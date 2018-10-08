package ch.focusit.reporting

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ReportingApplication

fun main(args: Array<String>) {
    runApplication<ReportingApplication>(*args)
}

