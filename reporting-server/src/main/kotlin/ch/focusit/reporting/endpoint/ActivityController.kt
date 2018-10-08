package ch.focusit.reporting.endpoint

import ch.focusit.reporting.domain.Activity
import ch.focusit.reporting.repository.ActivityRepository
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import java.time.LocalDate
import java.time.YearMonth
import javax.validation.Valid

@RestController
@RequestMapping("activities")
class ActivityController(val repository: ActivityRepository) {

    @GetMapping
    fun findAll() = repository.findAllByOrderByDateAsc()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun insert(@RequestBody activity: Activity) = repository.save(activity)

    @GetMapping("{date}")
    fun find(@PathVariable(value = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate) =
            repository.findByDate(date)
                    .map { activity: Activity -> ResponseEntity.ok(activity) }
                    .defaultIfEmpty(ResponseEntity(HttpStatus.NOT_FOUND))

    @PutMapping("{date}")
    fun update(@PathVariable(value = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate, @Valid @RequestBody updateActivity: Activity) =
            repository.findByDate(date)
                    .flatMap { existingActivity -> repository.save(existingActivity.copy(duration = updateActivity.duration)) }
                    .map { updatedActivity: Activity -> ResponseEntity.ok(updatedActivity) }
                    .defaultIfEmpty(ResponseEntity(HttpStatus.NOT_FOUND))

    @DeleteMapping("{date}")
    fun delete(@PathVariable(value = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate) =
            repository.findByDate(date)
                    .flatMap { existingActivity ->
                        repository.delete(existingActivity)
                                .then(Mono.just(ResponseEntity.ok("Delete successfully !")))
                    }
                    .defaultIfEmpty(ResponseEntity(HttpStatus.NOT_FOUND))

    @GetMapping("month/{month}")
    fun getByMonth(@PathVariable(value = "month") month: YearMonth) =
            repository.findAllByDateBetweenOrderByDateAsc(month.atDay(1).minusDays(1),
                    month.atEndOfMonth().plusDays(1))

    @GetMapping("date/{date}")
    fun getByMonth(@PathVariable(value = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate) =
            repository.findAllByDateBetweenOrderByDateAsc(date.withDayOfMonth(1).minusDays(1),
                    date.withDayOfMonth(1).plusMonths(1))
}
