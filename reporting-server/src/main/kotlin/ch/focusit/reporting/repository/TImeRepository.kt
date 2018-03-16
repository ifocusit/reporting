package ch.focusit.reporting.repository

import ch.focusit.reporting.domain.Time
import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface TimeRepository : ReactiveCrudRepository<Time, String> {
}