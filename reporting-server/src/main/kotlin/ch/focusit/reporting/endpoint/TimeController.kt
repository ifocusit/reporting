package ch.focusit.reporting.endpoint

import ch.focusit.reporting.domain.Time
import ch.focusit.reporting.repository.TimeRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import javax.validation.Valid

@RestController
@CrossOrigin(value = "*")
@RequestMapping("times")
class TimeController(val repository: TimeRepository) {

    @GetMapping
    fun findAll() = repository.findAll()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun insert(@RequestBody time: Time) = repository.save(time)

    @GetMapping("{id}")
    fun find(@PathVariable(value = "id") id: String) =
            repository.findById(id)
                    .map { time: Time -> ResponseEntity.ok(time) }
                    .defaultIfEmpty(ResponseEntity(HttpStatus.NOT_FOUND))

    @PutMapping("{id}")
    fun update(@PathVariable(value = "id") id: String, @Valid @RequestBody updateTime: Time) =
            repository.findById(id)
                    .flatMap { existingTime -> repository.save(existingTime.copy(time = updateTime.time)) }
                    .map { updatedTime: Time -> ResponseEntity.ok(updatedTime) }
                    .defaultIfEmpty(ResponseEntity(HttpStatus.NOT_FOUND))

    @DeleteMapping("{id}")
    fun delete(@PathVariable(value = "id") id: String) =
            repository.findById(id)
                    .flatMap { existingTime ->
                        repository.delete(existingTime)
                                .then(Mono.just(ResponseEntity.ok("Delete successfully !")))
                    }
                    .defaultIfEmpty(ResponseEntity(HttpStatus.NOT_FOUND))
}
