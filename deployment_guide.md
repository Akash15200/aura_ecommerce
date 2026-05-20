# Deployment Guide: Aura E-Commerce Platform

This guide outlines how to deploy the **Aura Frontend** on Vercel and the **Aura Backend Microservices** on Render, complete with cloud database provisioning.

---

## 1. Cloud Database & Infrastructure Setup
Before deploying the microservices, you need cloud instances for the databases. Use the following free/hobby tiers:

| Database / Broker | Recommended Provider | Connection Parameters Needed |
| :--- | :--- | :--- |
| **PostgreSQL** | Render Databases (Built-in) | Database URL, username, password |
| **Redis** | Render Cache (Built-in) | Redis Host, Redis Port |
| **MongoDB** | [MongoDB Atlas (M0 Free Tier)](https://www.mongodb.com/cloud/atlas) | MongoDB Connection URI |
| **Kafka** | [Upstash Kafka (Free Tier)](https://upstash.com/docs/kafka/overall/getstarted) | Bootstrap servers, SASL Username & Password |
| **Elasticsearch** | [Bonsai.io](https://bonsai.io/) or [Elastic Cloud](https://www.elastic.co/) | Elasticsearch URI |

---

## 2. Backend Deployment on Render

Render natively supports Java applications. You do **not** need Docker to deploy. The parent project will compile all modules, and each Render Web Service will execute its respective JAR.

### General Configuration for all Java Services:
* **Build Command**: `mvn clean package -DskipTests` (Run from repository root)
* **JVM Low-Memory Argument**: In the Render settings, add a `JAVA_OPTS` environment variable: `-XX:TieredStopAtLevel=1 -Xmx384m -Xms64m` to prevent Render's starter tier (512MB RAM) from hitting memory limits.

---

### Step 2.1: Deploy Eureka Discovery Server
1. In Render Dashboard, click **New > Web Service**.
2. Select your repository.
3. Configure settings:
   * **Name**: `aura-discovery-server`
   * **Runtime**: `Java`
   * **Build Command**: `mvn clean package -DskipTests`
   * **Start Command**: `java $JAVA_OPTS -jar backend/discovery-server/target/discovery-server-0.0.1-SNAPSHOT.jar`
   * **Instance Type**: `Starter` (or Free)

---

### Step 2.2: Deploy API Gateway (Public Gateway)
1. Create a new **Web Service** on Render.
2. Configure settings:
   * **Name**: `aura-api-gateway`
   * **Start Command**: `java $JAVA_OPTS -jar backend/api-gateway/target/api-gateway-0.0.1-SNAPSHOT.jar`
3. Add **Environment Variables**:
   * `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`: `https://aura-discovery-server.onrender.com/eureka/` (Replace with your actual Discovery Server URL)
   * `SPRING_DATA_REDIS_HOST`: (Your Render Redis Host)
   * `SPRING_DATA_REDIS_PORT`: (Your Render Redis Port)

---

### Step 2.3: Deploy Auth Service
1. Create a new **Web Service** on Render.
2. Configure settings:
   * **Name**: `aura-auth-service`
   * **Start Command**: `java $JAVA_OPTS -jar backend/auth-service/target/auth-service-0.0.1-SNAPSHOT.jar`
3. Add **Environment Variables**:
   * `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`: `https://aura-discovery-server.onrender.com/eureka/`
   * `SPRING_DATASOURCE_URL`: (Your Render PostgreSQL connection string, e.g. `jdbc:postgresql://<host>/aura_db`)
   * `SPRING_DATASOURCE_USERNAME`: (Postgres user)
   * `SPRING_DATASOURCE_PASSWORD`: (Postgres password)
   * `SPRING_DATA_REDIS_HOST`: (Your Render Redis Host)
   * `SPRING_DATA_REDIS_PORT`: (Your Render Redis Port)
   * `SPRING_KAFKA_BOOTSTRAP_SERVERS`: (Your Upstash/Cloud Kafka bootstrap servers url, e.g., `hostname:9092`)

---

### Step 2.4: Deploy Product Service
1. Create a new **Web Service** on Render.
2. Configure settings:
   * **Name**: `aura-product-service`
   * **Start Command**: `java $JAVA_OPTS -jar backend/product-service/target/product-service-0.0.1-SNAPSHOT.jar`
3. Add **Environment Variables**:
   * `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`: `https://aura-discovery-server.onrender.com/eureka/`
   * `SPRING_DATASOURCE_URL`: (Postgres Connection URL)
   * `SPRING_DATASOURCE_USERNAME`: (Postgres Username)
   * `SPRING_DATASOURCE_PASSWORD`: (Postgres Password)
   * `SPRING_DATA_REDIS_HOST`: (Redis Host)
   * `SPRING_DATA_REDIS_PORT`: (Redis Port)
   * `SPRING_ELASTICSEARCH_URIS`: (Your cloud Elasticsearch URL, e.g., `https://my-bonsai-url.bonsai.io`)

---

### Step 2.5: Deploy Order Service
1. Create a new **Web Service** on Render.
2. Configure settings:
   * **Name**: `aura-order-service`
   * **Start Command**: `java $JAVA_OPTS -jar backend/order-service/target/order-service-0.0.1-SNAPSHOT.jar`
3. Add **Environment Variables**:
   * `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`: `https://aura-discovery-server.onrender.com/eureka/`
   * `SPRING_DATASOURCE_URL`: (Postgres Connection URL)
   * `SPRING_DATASOURCE_USERNAME`: (Postgres Username)
   * `SPRING_DATASOURCE_PASSWORD`: (Postgres Password)
   * `SPRING_DATA_REDIS_HOST`: (Redis Host)
   * `SPRING_DATA_REDIS_PORT`: (Redis Port)
   * `SPRING_KAFKA_BOOTSTRAP_SERVERS`: (Kafka Bootstrap URL)

*(Follow the exact same template for optional services like `payment-service`, `review-service`, `recommendation-service`, `notification-service`, and `analytics-service` if you need them. Ensure MongoDB URI variables are added for review/recommendation/analytics services).*

---

## 3. Frontend Deployment on Vercel

Vercel provides seamless deployment for modern React apps.

1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New > Project**.
2. Select your imported GitHub repository.
3. Configure the Project parameters:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click *Edit* and select the **`frontend`** directory.
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Add **Environment Variables**:
   * **Key**: `VITE_API_BASE_URL`
   * **Value**: `https://aura-api-gateway.onrender.com/api` (Replace with the public URL generated by your Render API Gateway service!)
5. Click **Deploy**. Vercel will build the frontend and serve it at a public `https://*.vercel.app` domain.
