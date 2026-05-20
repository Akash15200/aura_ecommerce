package com.aura.order.service;

import com.aura.order.model.Order;
import com.aura.order.model.OrderItem;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class InvoiceService {

    public byte[] generateInvoicePdf(Order order) {
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Set luxury fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Font.BOLD);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Font.NORMAL);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Font.BOLD);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Font.BOLD);

            // Document Header
            Paragraph title = new Paragraph("A U R A", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            Paragraph subtitle = new Paragraph("COMMERCIAL INVOICE RECEIPT", headerFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(15);
            document.add(subtitle);

            // Meta Info Grid
            Paragraph metadata = new Paragraph();
            metadata.setFont(labelFont);
            metadata.add("Order Reference ID: #" + order.getId() + "\n");
            metadata.add("Date Issued: " + order.getOrderDate().toString() + "\n");
            metadata.add("Shipping Tracker: " + order.getTrackingNumber() + "\n");
            metadata.add("Address Profile: " + order.getShippingAddress() + "\n\n");
            document.add(metadata);

            // Line Items Grid
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{4f, 1f, 1.5f, 1.5f});

            // Set Headers
            table.addCell(new PdfPCell(new Phrase("Product Title", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Qty", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Unit Price", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Subtotal", headerFont)));

            for (OrderItem item : order.getOrderItems()) {
                table.addCell(new PdfPCell(new Phrase(item.getProductName(), labelFont)));
                table.addCell(new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), labelFont)));
                table.addCell(new PdfPCell(new Phrase(String.format("$%.2f", item.getPrice()), labelFont)));
                table.addCell(new PdfPCell(new Phrase(String.format("$%.2f", item.getPrice() * item.getQuantity()), labelFont)));
            }
            table.setSpacingAfter(15);
            document.add(table);

            // Totals breakdown
            Paragraph totals = new Paragraph();
            totals.setFont(labelFont);
            totals.setAlignment(Element.ALIGN_RIGHT);
            totals.add(String.format("Cart Subtotal: $%.2f\n", order.getSubtotal()));
            totals.add(String.format("Promotion Discount: -$%.2f\n", order.getDiscount()));
            totals.add(String.format("VAT Tax (10%%): $%.2f\n", order.getTax()));
            totals.add(new Phrase(String.format("Grand Total Cost: $%.2f\n\n", order.getFinalAmount()), boldFont));
            document.add(totals);

            // Signatures block
            Paragraph signature = new Paragraph("Approved & Released by Aura Luxury Logistics", labelFont);
            signature.setAlignment(Element.ALIGN_CENTER);
            document.add(signature);

            document.close();
        } catch (DocumentException e) {
            System.err.println("Failed to compile OpenPDF receipt structure: " + e.getMessage());
        }

        return out.toByteArray();
    }
}
