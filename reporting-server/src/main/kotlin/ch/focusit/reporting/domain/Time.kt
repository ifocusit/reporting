package ch.focusit.reporting.domain

import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "times")
class Time(var date: LocalDateTime)