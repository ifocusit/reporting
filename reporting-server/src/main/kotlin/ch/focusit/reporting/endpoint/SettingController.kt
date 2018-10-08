package ch.focusit.reporting.endpoint

import ch.focusit.reporting.domain.Setting
import ch.focusit.reporting.repository.SettingRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import javax.validation.Valid

@RestController
@RequestMapping("settings")
class SettingController(val repository: SettingRepository) {

    @GetMapping
    fun findAll() = repository.findAll()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun insert(@RequestBody setting: Setting) = repository.save(setting)

    @PutMapping("{name}")
    fun update(@PathVariable(value = "name") name: String, @Valid @RequestBody value: String) =
            repository.findById(name)
                    .flatMap { existing -> repository.save(existing.copy(value = value)) }
                    .map { updated -> ResponseEntity.ok(updated) }
                    .defaultIfEmpty(ResponseEntity(HttpStatus.NOT_FOUND))

    @DeleteMapping("{name}")
    fun delete(@PathVariable(value = "name") name: String) =
            repository.findById(name)
                    .flatMap { existing ->
                        repository.delete(existing).then(Mono.just(ResponseEntity.ok("Delete successfully !")))
                    }
                    .defaultIfEmpty(ResponseEntity(HttpStatus.NOT_FOUND))

}
