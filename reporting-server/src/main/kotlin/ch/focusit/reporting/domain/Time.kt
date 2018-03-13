package ch.focusit.reporting.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "times")
class Time(@Id val handle: String, var date: LocalDateTime)