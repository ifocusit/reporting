package ch.focusit.reporting.repository

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import ch.focusit.reporting.domain.Time
import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface TimeRepository : ReactiveCrudRepository<Time, String> {

    fn findByDate() : Flux<Time>
}