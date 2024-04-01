package com.taylorzhangyx.bugtracker.web.rest;

import com.taylorzhangyx.bugtracker.service.api.dto.Pet;
import com.taylorzhangyx.bugtracker.web.api.PetApiDelegate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.NativeWebRequest;

@Service
public class PetApiDelegateImpl implements PetApiDelegate {

    private final NativeWebRequest request;

    public PetApiDelegateImpl(NativeWebRequest request) {
        this.request = request;
    }

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.ofNullable(request);
    }

    @Override
    public ResponseEntity<List<Pet>> findPetsByStatus(String status) {
        return ResponseEntity.ok(
            Arrays.stream(Pet.StatusEnum.values())
                .filter(statusEnum -> statusEnum.name().equalsIgnoreCase(status))
                .map(statusEnum -> new Pet().id(ThreadLocalRandom.current().nextLong()).status(statusEnum))
                .collect(Collectors.toList())
        );
    }
}
