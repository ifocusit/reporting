package ch.focusit.reporting.endpoint

import ch.focusit.reporting.repository.TimeRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController("/times")
class TimeController(var repository: TimeRepository) {

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/")
    fun findAll() = repository.findAll()

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/hello")
    fun hello(): Any {
        return "Hello world !"
    }
}
