package com.taylorzhangyx.bugtracker.repository;

import com.taylorzhangyx.bugtracker.domain.Ticket;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class TicketRepositoryWithBagRelationshipsImpl implements TicketRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String TICKETS_PARAMETER = "tickets";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Ticket> fetchBagRelationships(Optional<Ticket> ticket) {
        return ticket.map(this::fetchLabels);
    }

    @Override
    public Page<Ticket> fetchBagRelationships(Page<Ticket> tickets) {
        return new PageImpl<>(fetchBagRelationships(tickets.getContent()), tickets.getPageable(), tickets.getTotalElements());
    }

    @Override
    public List<Ticket> fetchBagRelationships(List<Ticket> tickets) {
        return Optional.of(tickets).map(this::fetchLabels).orElse(Collections.emptyList());
    }

    Ticket fetchLabels(Ticket result) {
        return entityManager
            .createQuery("select ticket from Ticket ticket left join fetch ticket.labels where ticket.id = :id", Ticket.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Ticket> fetchLabels(List<Ticket> tickets) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, tickets.size()).forEach(index -> order.put(tickets.get(index).getId(), index));
        List<Ticket> result = entityManager
            .createQuery("select ticket from Ticket ticket left join fetch ticket.labels where ticket in :tickets", Ticket.class)
            .setParameter(TICKETS_PARAMETER, tickets)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
