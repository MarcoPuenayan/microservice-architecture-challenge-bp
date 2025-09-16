package com.pichincha.account.transaction.infrastructure.output.helper;

import static com.pichincha.account.transaction.domain.utils.Constants.PDF_GENERATION_ERROR;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.pichincha.account.transaction.infrastructure.exception.GlobalErrorException;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.TransactionReport;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Stream;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class PdfGenerator {

    public byte[] generatePdf(List<TransactionReport> reports) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            document.add(new Paragraph("Reporte de Movimientos", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            addTableHeader(table);
            for (TransactionReport report : reports) {
                addRows(table, report);
            }
            document.add(table);
            document.close();

            return baos.toByteArray();
        } catch (Exception e) {
            throw new GlobalErrorException(PDF_GENERATION_ERROR,
                "generatePdf", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void addTableHeader(PdfPTable table) {
        Stream.of("Fecha", "Cliente", "Cuenta", "Tipo", "Saldo Inicial", "Estado", "Movimiento", "Saldo Disponible")
            .forEach(columnTitle -> {
                PdfPCell header = new PdfPCell();
                header.setPhrase(new Phrase(columnTitle));
                header.setBackgroundColor(Color.LIGHT_GRAY);
                table.addCell(header);
            });
    }

    private void addRows(PdfPTable table, TransactionReport report) {
        table.addCell(report.getDate());
        table.addCell(report.getCustomerName());
        table.addCell(report.getAccountNumber());
        table.addCell(report.getAccountTypeDescription());
        table.addCell(report.getInitialBalance().toString());
        table.addCell(report.getStatus().toString());
        table.addCell(report.getTransactionValue().toString());
        table.addCell(report.getAvailableBalance().toString());
    }
}