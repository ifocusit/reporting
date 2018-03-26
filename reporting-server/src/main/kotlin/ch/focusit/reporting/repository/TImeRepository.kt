package ch.focusit.reporting.repository

import ch.focusit.reporting.domain.Time
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import java.time.LocalDateTime

interface TimeRepository : ReactiveCrudRepository<Time, String> {

    fun findAllByOrderByTimeAsc(): Flux<Time>

    fun findAllByTimeBetweenOrderByTimeAsc(start: LocalDateTime, end: LocalDateTime): Flux<Time>
}