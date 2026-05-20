package com.aura.ecommerce.service;

import com.lowagie.text.Cell;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Table;
import com.lowagie.text.pdf.PdfWriter;
import com.aura.ecommerce.entity.Order;
import com.aura.ecommerce.entity.OrderItem;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@Service
public class InvoiceService {

    public ByteArrayInputStream generateInvoicePdf(Order order) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font configurations
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24);
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Font regularFont = FontFactory.getFont(FontFactory.HELVETICA, 11);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);

            // Document Header
            Paragraph title = new Paragraph("A U R A   E - C O M M E R C E", headerFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            Paragraph slogan = new Paragraph("Curated Luxury Minimalist Lifestyle", regularFont);
            slogan.setAlignment(Element.ALIGN_CENTER);
            slogan.setSpacingAfter(25);
            document.add(slogan);

            // Invoice Metadata Section
            document.add(new Paragraph("INVOICE SUMMARY", subHeaderFont));
            document.add(new Paragraph("------------------------------------------------------------------------------------------------------------------------", regularFont));
            document.add(new Paragraph("Order Reference ID:  #" + order.getId(), boldFont));
            document.add(new Paragraph("Order Timestamp:       " + order.getOrderDate().toString(), regularFont));
            document.add(new Paragraph("Customer Account:     " + order.getUser().getName() + " (" + order.getUser().getEmail() + ")", regularFont));
            document.add(new Paragraph("Shipping Address:     " + order.getShippingAddress(), regularFont));
            document.add(new Paragraph("Billing Address:      " + order.getBillingAddress(), regularFont));
            document.add(new Paragraph("Payment Method:       " + order.getPaymentMethod(), regularFont));
            document.add(new Paragraph("Delivery Tracker:     " + (order.getTrackingNumber() != null ? order.getTrackingNumber() : "AURA-SHP-PENDING"), regularFont));
            document.add(new Paragraph("\n"));

            // Items Summary Table
            Table table = new Table(4);
            table.setWidth(100);
            table.setPadding(6);

            Cell cell1 = new Cell(new Paragraph("Product Name", boldFont));
            Cell cell2 = new Cell(new Paragraph("Unit Price", boldFont));
            Cell cell3 = new Cell(new Paragraph("Qty", boldFont));
            Cell cell4 = new Cell(new Paragraph("Line Total", boldFont));

            cell1.setHeader(true);
            cell2.setHeader(true);
            cell3.setHeader(true);
            cell4.setHeader(true);

            table.addCell(cell1);
            table.addCell(cell2);
            table.addCell(cell3);
            table.addCell(cell4);

            for (OrderItem item : order.getOrderItems()) {
                table.addCell(new Cell(new Paragraph(item.getProduct().getName(), regularFont)));
                table.addCell(new Cell(new Paragraph("$" + String.format("%.2f", item.getPrice()), regularFont)));
                table.addCell(new Cell(new Paragraph(String.valueOf(item.getQuantity()), regularFont)));
                table.addCell(new Cell(new Paragraph("$" + String.format("%.2f", item.getPrice() * item.getQuantity()), regularFont)));
            }

            document.add(table);
            document.add(new Paragraph("\n"));

            // Financial Summary
            document.add(new Paragraph("Subtotal Amount:      $" + String.format("%.2f", order.getTotalAmount()), regularFont));
            if (order.getDiscountAmount() > 0) {
                document.add(new Paragraph("Discount Applied:    -$" + String.format("%.2f", order.getDiscountAmount()) + " (" + (order.getCouponCode() != null ? order.getCouponCode() : "Loyalty rewards") + ")", regularFont));
            }
            document.add(new Paragraph("Estimated Tax (10%):  $" + String.format("%.2f", order.getTaxAmount()), regularFont));
            document.add(new Paragraph("Grand Total Cost:     $" + String.format("%.2f", order.getFinalAmount()), boldFont));
            document.add(new Paragraph("\n\n"));

            // Footer Greeting
            Paragraph footer = new Paragraph("Thank you for shopping at Aura! Enjoy your curated luxury goods.", regularFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
