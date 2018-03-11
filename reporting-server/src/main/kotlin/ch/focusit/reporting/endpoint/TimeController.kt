package ch.focusit.reporting.endpoint

import ch.focusit.reporting.repository.TimeRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.concurrent.atomic.AtomicLong

@RestController()
class TimeController(var repository: TimeRepository) {

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/")
    fun findAll() = repository.findAll()

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/hello")
    fun hello(): Any {
        return "Hello world !"
    }

    val counter = AtomicLong()

    @GetMapping("/greeting")
    fun greeting(@RequestParam(value = "name", defaultValue = "World") name: String) =
            Greeting(counter.incrementAndGet(), "Hello, $name")
}

data class Greeting(val id: Long, val content: String)
