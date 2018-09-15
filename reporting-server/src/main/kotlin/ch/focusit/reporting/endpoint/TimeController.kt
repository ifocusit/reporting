package ch.focusit.reporting.endpoint

import ch.focusit.reporting.domain.Time
import ch.focusit.reporting.repository.TimeRepository
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.toFlux
import reactor.core.publisher.toMono
import java.time.LocalDate
import java.time.Year
import java.time.YearMonth
import java.time.temporal.Temporal
import java.util.regex.Pattern
import javax.validation.Valid

@RestController
@CrossOrigin("*")
@RequestMapping("times")
class TimeController(val repository: TimeRepository) {

    companion object {
        @JvmStatic
        val PATTERN_DAY = Pattern.compile("(\\d{4}-\\d{2}-\\d{2})")!!
        @JvmStatic
        val PATTERN_MONTH = Pattern.compile("(\\d{4}-\\d{2})")!!
        @JvmStatic
        val PATTERN_YEAR = Pattern.compile("(\\d{4})")!!
    }

    @GetMapping
    fun findAll() = repository.findAllByOrderByTimeAsc()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun insert(@RequestBody time: Time) = repository.save(time)

    @GetMapping("{id}")
    fun find(@PathVariable("id") id: String) =
            repository.findById(id)
                    .map { time: Time -> ResponseEntity.ok(time) }
                    .defaultIfEmpty(ResponseEntity(HttpStatus.NOT_FOUND))

    @PutMapping("{id}")
    fun update(@PathVariable("id") id: String, @Valid @RequestBody updateTime: Time) =
            repository.findById(id)
                    .flatMap { existingTime -> repository.save(existingTime.copy(time = updateTime.time)) }
                    .map { updatedTime: Time -> ResponseEntity.ok(updatedTime) }
                    .defaultIfEmpty(ResponseEntity(HttpStatus.NOT_FOUND))

    @DeleteMapping("{id}")
    fun delete(@PathVariable("id") id: String) =
            repository.findById(id)
                    .flatMap { existingTime -> repository.delete(existingTime).then(Mono.just(ResponseEntity.ok(null))) }
                    .defaultIfEmpty(ResponseEntity(HttpStatus.NOT_FOUND))

    @GetMapping("month/{month}")
    fun getByDate(@PathVariable("month") month: YearMonth) =
            repository.findAllByTimeBetweenOrderByTimeAsc(month.atDay(1).atStartOfDay(), month.atEndOfMonth().plusDays(1).atStartOfDay())

    @GetMapping("year/{year}")
    fun getByDate(@PathVariable("year") year: Year) =
            repository.findAllByTimeBetweenOrderByTimeAsc(year.atDay(1).atStartOfDay(), year.atDay(1).plusYears(1).atStartOfDay())

    @GetMapping("day/{day}")
    fun getByDate(@PathVariable("day") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) day: LocalDate) =
            repository.findAllByTimeBetweenOrderByTimeAsc(day.atStartOfDay(), day.plusDays(1).atStartOfDay())

    @GetMapping("date/{date}")
    fun getByDate(@PathVariable("date") date: String) =
            readDay(date)
                    .switchIfEmpty(readMonth(date))
                    .switchIfEmpty(readYear(date))
                    .flatMap { temporal ->
                        when (temporal) {
                            is LocalDate -> getByDate(temporal)
                            is YearMonth -> getByDate(temporal)
                            else -> getByDate(temporal as Year)
                        }
                    }

    private fun readDay(date: String): Flux<Temporal> = PATTERN_DAY.matcher(date).toMono().toFlux()
            .filter { matches -> matches.find() }
            .map { matches -> LocalDate.parse(matches.group()) }

    private fun readMonth(date: String): Flux<Temporal> = PATTERN_MONTH.matcher(date).toMono().toFlux()
            .filter { matches -> matches.find() }
            .map { matches -> YearMonth.parse(matches.group()) }

    private fun readYear(date: String): Flux<Temporal> = PATTERN_YEAR.matcher(date).toMono().toFlux()
            .filter { matches -> matches.find() }
            .map { matches -> Year.parse(matches.group()) }
}
