package com.taylorzhangyx.bugtracker.web.rest;

import com.taylorzhangyx.bugtracker.domain.Ticket;
import com.taylorzhangyx.bugtracker.repository.TicketRepository;
import com.taylorzhangyx.bugtracker.security.AuthoritiesConstants;
import com.taylorzhangyx.bugtracker.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing
 * {@link com.taylorzhangyx.bugtracker.domain.Ticket}.
 */
@RestController
@RequestMapping("/api/tickets")
@Transactional
public class TicketResource {

    private final Logger log = LoggerFactory.getLogger(TicketResource.class);

    private static final String ENTITY_NAME = "ticket";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TicketRepository ticketRepository;

    public TicketResource(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    /**
     * {@code POST  /tickets} : Create a new ticket.
     *
     * @param ticket the ticket to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new ticket, or with status {@code 400 (Bad Request)} if the
     *         ticket has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody Ticket ticket) throws URISyntaxException {
        log.debug("REST request to save Ticket : {}", ticket);
        if (ticket.getId() != null) {
            throw new BadRequestAlertException("A new ticket cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ticket = ticketRepository.save(ticket);
        return ResponseEntity.created(new URI("/api/tickets/" + ticket.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, ticket.getId().toString()))
            .body(ticket);
    }

    /**
     * {@code PUT  /tickets/:id} : Updates an existing ticket.
     *
     * @param id     the id of the ticket to save.
     * @param ticket the ticket to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated ticket,
     *         or with status {@code 400 (Bad Request)} if the ticket is not valid,
     *         or with status {@code 500 (Internal Server Error)} if the ticket
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Ticket ticket
    ) throws URISyntaxException {
        log.debug("REST request to update Ticket : {}, {}", id, ticket);
        if (ticket.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticket.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ticket = ticketRepository.save(ticket);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticket.getId().toString()))
            .body(ticket);
    }

    /**
     * {@code PATCH  /tickets/:id} : Partial updates given fields of an existing
     * ticket, field will ignore if it is null
     *
     * @param id     the id of the ticket to save.
     * @param ticket the ticket to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated ticket,
     *         or with status {@code 400 (Bad Request)} if the ticket is not valid,
     *         or with status {@code 404 (Not Found)} if the ticket is not found,
     *         or with status {@code 500 (Internal Server Error)} if the ticket
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Ticket> partialUpdateTicket(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Ticket ticket
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ticket partially : {}, {}", id, ticket);
        if (ticket.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticket.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ticket> result = ticketRepository
            .findById(ticket.getId())
            .map(existingTicket -> {
                if (ticket.getTitle() != null) {
                    existingTicket.setTitle(ticket.getTitle());
                }
                if (ticket.getDescription() != null) {
                    existingTicket.setDescription(ticket.getDescription());
                }
                if (ticket.getDueDate() != null) {
                    existingTicket.setDueDate(ticket.getDueDate());
                }
                if (ticket.getDone() != null) {
                    existingTicket.setDone(ticket.getDone());
                }
                if (ticket.getNewEntity() != null) {
                    existingTicket.setNewEntity(ticket.getNewEntity());
                }
                if (ticket.getSomeInfo() != null) {
                    existingTicket.setSomeInfo(ticket.getSomeInfo());
                }

                return existingTicket;
            })
            .map(ticketRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticket.getId().toString())
        );
    }

    /**
     * {@code GET  /tickets} : get all the tickets.
     *
     * @param pageable  the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is
     *                  applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of tickets in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Ticket>> getAllTickets(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Tickets");
        Page<Ticket> page;
        if (eagerload) {
            page = ticketRepository.findAllWithEagerRelationships(pageable);
        } else {
            // page = ticketRepository.findAll(pageable);
            page = ticketRepository.findAllByOrderByDueDateAsc(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /tickets/:id} : get the "id" ticket.
     *
     * @param id the id of the ticket to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the ticket, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable("id") Long id) {
        log.debug("REST request to get Ticket : {}", id);
        Optional<Ticket> ticket = ticketRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(ticket);
    }

    @GetMapping("/self")
    public ResponseEntity<List<Ticket>> getAllSelfTickets(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of user's Tickets");
        Page<Ticket> page;
        if (eagerload) {
            page = ticketRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = new PageImpl<>(ticketRepository.findByAssignedToIsCurrentUser());
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code DELETE  /tickets/:id} : delete the "id" ticket.
     *
     * @param id the id of the ticket to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Void> deleteTicket(@PathVariable("id") Long id) {
        log.debug("REST request to delete Ticket : {}", id);
        ticketRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
