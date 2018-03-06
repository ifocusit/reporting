package ch.focusit.reporting.repository

import ch.focusit.reporting.domain.Time
import org.springframework.data.repository.CrudRepository

interface TimeRepository : CrudRepository<Time, String>