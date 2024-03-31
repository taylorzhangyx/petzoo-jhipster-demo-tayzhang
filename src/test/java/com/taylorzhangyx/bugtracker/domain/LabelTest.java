package com.taylorzhangyx.bugtracker.domain;

import static com.taylorzhangyx.bugtracker.domain.LabelTestSamples.*;
import static com.taylorzhangyx.bugtracker.domain.TicketTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.taylorzhangyx.bugtracker.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class LabelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Label.class);
        Label label1 = getLabelSample1();
        Label label2 = new Label();
        assertThat(label1).isNotEqualTo(label2);

        label2.setId(label1.getId());
        assertThat(label1).isEqualTo(label2);

        label2 = getLabelSample2();
        assertThat(label1).isNotEqualTo(label2);
    }

    @Test
    void ticketTest() throws Exception {
        Label label = getLabelRandomSampleGenerator();
        Ticket ticketBack = getTicketRandomSampleGenerator();

        label.addTicket(ticketBack);
        assertThat(label.getTickets()).containsOnly(ticketBack);
        assertThat(ticketBack.getLabels()).containsOnly(label);

        label.removeTicket(ticketBack);
        assertThat(label.getTickets()).doesNotContain(ticketBack);
        assertThat(ticketBack.getLabels()).doesNotContain(label);

        label.tickets(new HashSet<>(Set.of(ticketBack)));
        assertThat(label.getTickets()).containsOnly(ticketBack);
        assertThat(ticketBack.getLabels()).containsOnly(label);

        label.setTickets(new HashSet<>());
        assertThat(label.getTickets()).doesNotContain(ticketBack);
        assertThat(ticketBack.getLabels()).doesNotContain(label);
    }
}
