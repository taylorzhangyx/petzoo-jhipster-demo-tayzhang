package com.taylorzhangyx.bugtracker.domain;

import static com.taylorzhangyx.bugtracker.domain.LabelTestSamples.*;
import static com.taylorzhangyx.bugtracker.domain.ProjectTestSamples.*;
import static com.taylorzhangyx.bugtracker.domain.TicketTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.taylorzhangyx.bugtracker.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class TicketTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ticket.class);
        Ticket ticket1 = getTicketSample1();
        Ticket ticket2 = new Ticket();
        assertThat(ticket1).isNotEqualTo(ticket2);

        ticket2.setId(ticket1.getId());
        assertThat(ticket1).isEqualTo(ticket2);

        ticket2 = getTicketSample2();
        assertThat(ticket1).isNotEqualTo(ticket2);
    }

    @Test
    void projectTest() throws Exception {
        Ticket ticket = getTicketRandomSampleGenerator();
        Project projectBack = getProjectRandomSampleGenerator();

        ticket.setProject(projectBack);
        assertThat(ticket.getProject()).isEqualTo(projectBack);

        ticket.project(null);
        assertThat(ticket.getProject()).isNull();
    }

    @Test
    void labelTest() throws Exception {
        Ticket ticket = getTicketRandomSampleGenerator();
        Label labelBack = getLabelRandomSampleGenerator();

        ticket.addLabel(labelBack);
        assertThat(ticket.getLabels()).containsOnly(labelBack);

        ticket.removeLabel(labelBack);
        assertThat(ticket.getLabels()).doesNotContain(labelBack);

        ticket.labels(new HashSet<>(Set.of(labelBack)));
        assertThat(ticket.getLabels()).containsOnly(labelBack);

        ticket.setLabels(new HashSet<>());
        assertThat(ticket.getLabels()).doesNotContain(labelBack);
    }
}
