// Shopify Storefront API GraphQL Client

const getStoreDomain = () => import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const getAccessToken = () => import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

export const isShopifyConfigured = () => {
  return !!(getStoreDomain() && getAccessToken());
};

// Generic GraphQL Fetch Wrapper
const shopifyFetch = async (query, variables = {}) => {
  const domain = getStoreDomain();
  const token = getAccessToken();

  if (!domain || !token) {
    throw new Error('Shopify storefront domain or access token is not configured.');
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const url = `https://${cleanDomain}/api/2024-04/graphql.json`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify network request failed: ${response.statusText}`);
    }

    const json = await response.json();
    if (json.errors) {
      console.error('Shopify GraphQL Errors:', json.errors);
      throw new Error(`Shopify GraphQL error: ${json.errors[0]?.message || 'Unknown error'}`);
    }

    return json.data;
  } catch (error) {
    console.error('Shopify Fetch Error:', error);
    throw error;
  }
};

// Mapping helper to translate Shopify GraphQL objects into the React app's schema
const mapShopifyProduct = (node) => {
  const defaultVariant = node.variants?.edges?.[0]?.node || {};
  const price = parseFloat(defaultVariant.price?.amount || 0);
  const comparePrice = parseFloat(defaultVariant.compareAtPrice?.amount || 0);
  
  let discountPercentage = 0;
  if (comparePrice > price) {
    discountPercentage = Math.round(((comparePrice - price) / comparePrice) * 100);
  }

  const imageUrl = node.images?.edges?.[0]?.node?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80';
  const categoryNode = node.collections?.edges?.[0]?.node || {};

  return {
    id: node.handle, // Use handle as the frontend ID for clean URL routes without slashes
    shopifyProductId: node.id, // Keep raw Shopify Product GID
    name: node.title,
    handle: node.handle,
    description: node.description,
    // If there is a discount comparePrice is the original price, and price is the discounted price.
    // The React app calculates discount price from: price * (1 - discountPercentage/100)
    price: comparePrice > price ? comparePrice : price,
    discountPercentage,
    imageUrl,
    stockQuantity: defaultVariant.quantityAvailable !== undefined && defaultVariant.quantityAvailable !== null
      ? defaultVariant.quantityAvailable
      : (defaultVariant.currentlyNotInStock === false ? 50 : 0),
    rating: 4.6, // Default rating (Shopify storefront has no native reviews/ratings out of the box)
    reviewCount: 12,
    tags: node.tags?.join(', ') || '',
    categoryId: categoryNode.id || 'all',
    categoryName: categoryNode.title || 'General',
    category: {
      id: categoryNode.id || 'all',
      name: categoryNode.title || 'General',
    },
    shopifyVariantId: defaultVariant.id,
  };
};

const mapShopifyCollection = (node) => {
  return {
    id: node.id,
    name: node.title,
    description: node.description || '',
    imageUrl: node.image?.url || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80'
  };
};

// 1. Fetch Categories (Shopify Collections)
export const getCategories = async () => {
  const query = `
    query getCollections {
      collections(first: 50) {
        edges {
          node {
            id
            title
            description
            image {
              url
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query);
  const collections = data?.collections?.edges?.map(edge => mapShopifyCollection(edge.node)) || [];
  return collections;
};

// 2. Fetch Products with in-memory filtering/sorting/pagination for optimal hybrid UX
export const getProducts = async (page = 0, size = 6, sortBy = 'id', sortDir = 'asc', categoryId = '', minPrice = 0, maxPrice = 5000) => {
  const query = `
    query getProducts {
      products(first: 250) {
        edges {
          node {
            id
            title
            handle
            description
            tags
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            collections(first: 5) {
              edges {
                node {
                  id
                  title
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                  }
                  compareAtPrice {
                    amount
                  }
                  quantityAvailable
                  currentlyNotInStock
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query);
  let list = data?.products?.edges?.map(edge => mapShopifyProduct(edge.node)) || [];

  // Filter by category
  if (categoryId && categoryId !== 'all') {
    list = list.filter(p => p.categoryId.toString() === categoryId.toString());
  }

  // Filter by price range
  list = list.filter(p => {
    const finalPrice = p.price * (1 - (p.discountPercentage / 100));
    return finalPrice >= minPrice && finalPrice <= maxPrice;
  });

  // Sort
  list.sort((a, b) => {
    let valA, valB;
    if (sortBy === 'price') {
      valA = a.price * (1 - (a.discountPercentage / 100));
      valB = b.price * (1 - (b.discountPercentage / 100));
    } else if (sortBy === 'rating') {
      valA = a.rating;
      valB = b.rating;
    } else {
      valA = a.handle; // Sort by handle/slug in Shopify mode instead of numeric id
      valB = b.handle;
    }

    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalElements = list.length;
  const totalPages = Math.ceil(totalElements / size);
  const paginatedContent = list.slice(page * size, (page + 1) * size);

  return {
    content: paginatedContent,
    totalPages: totalPages || 1,
    totalElements: totalElements
  };
};

// 3. Fetch Product details by ID or Handle
export const getProductById = async (handleOrId) => {
  if (handleOrId.startsWith('gid://')) {
    const query = `
      query getProductById($id: ID!) {
        node(id: $id) {
          ... on Product {
            id
            title
            handle
            description
            tags
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            collections(first: 5) {
              edges {
                node {
                  id
                  title
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                  }
                  compareAtPrice {
                    amount
                  }
                  quantityAvailable
                  currentlyNotInStock
                }
              }
            }
          }
        }
      }
    `;
    const data = await shopifyFetch(query, { id: handleOrId });
    return data?.node ? mapShopifyProduct(data.node) : null;
  } else {
    const query = `
      query getProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          tags
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          collections(first: 5) {
            edges {
              node {
                id
                title
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                }
                compareAtPrice {
                  amount
                }
                quantityAvailable
                currentlyNotInStock
              }
            }
          }
        }
      }
    `;
    const data = await shopifyFetch(query, { handle: handleOrId });
    return data?.product ? mapShopifyProduct(data.product) : null;
  }
};

// 4. Search Products
export const aiSearch = async (searchQuery = '') => {
  const query = `
    query searchProducts($query: String!) {
      products(first: 50, query: $query) {
        edges {
          node {
            id
            title
            handle
            description
            tags
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            collections(first: 1) {
              edges {
                node {
                  id
                  title
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                  }
                  compareAtPrice {
                    amount
                  }
                  quantityAvailable
                  currentlyNotInStock
                }
              }
            }
          }
        }
      }
    }
  `;
  // Search in Shopify using the query
  const data = await shopifyFetch(query, { query: searchQuery || '' });
  return data?.products?.edges?.map(edge => mapShopifyProduct(edge.node)) || [];
};

// 5. Create Shopify Checkout URL using Shopify Cart Mutation
export const createCheckout = async (items) => {
  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Prepare cart lines
  const lines = items.map(item => ({
    merchandiseId: item.product.shopifyVariantId || item.product.id, // Fall back to product.id if no variant ID (though variant ID is preferred)
    quantity: item.quantity
  }));

  const variables = {
    input: { lines }
  };

  const data = await shopifyFetch(mutation, variables);
  const cartCreate = data?.cartCreate;

  if (cartCreate?.userErrors && cartCreate.userErrors.length > 0) {
    throw new Error(cartCreate.userErrors[0].message);
  }

  return cartCreate?.cart?.checkoutUrl;
};
