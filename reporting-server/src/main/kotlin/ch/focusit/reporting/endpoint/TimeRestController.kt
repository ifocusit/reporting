package ch.focusit.reporting.endpoint

import ch.focusit.reporting.repository.TimeRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.concurrent.atomic.AtomicLong

@RestController()
class TimeRestController(var repository: TimeRepository) {

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/")
    fun findAll() = repository.findAll()

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}")
    fun findById(@RequestParam(value = "id") id: String) = repository.findById(id)

}
