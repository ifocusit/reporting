package ch.focusit.reporting.repository

import ch.focusit.reporting.domain.Activity
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.LocalDate

interface ActivityRepository : ReactiveCrudRepository<Activity, String> {

    fun findByDate(date: LocalDate): Mono<Activity>

    fun findAllByOrderByDateAsc(): Flux<Activity>

    fun findAllByDateBetweenOrderByDateAsc(start: LocalDate, end: LocalDate): Flux<Activity>
}