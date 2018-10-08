package ch.focusit.reporting.endpoint

import ch.focusit.reporting.domain.Setting
import ch.focusit.reporting.domain.Time
import ch.focusit.reporting.repository.SettingRepository
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import reactor.core.publisher.Flux
import reactor.core.publisher.GroupedFlux
import reactor.core.publisher.Mono
import java.math.RoundingMode
import java.text.DecimalFormat
import java.time.Duration
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.DateTimeFormatter
import java.util.concurrent.atomic.AtomicInteger
import java.util.stream.Collectors

@Controller
@RequestMapping("billing")
class BillingController(val timeController: TimeController, val settingRepository: SettingRepository) {

    @GetMapping("/generate/{month}")
    fun getByMonth(@PathVariable(value = "month") month: YearMonth, model: Model): Mono<String> {
        model.addAttribute("month", month.format(DateTimeFormatter.ofPattern("MMMM")))
        model.addAttribute("id", month.year.toString().replaceFirst("20", "2") +
                month.format(DateTimeFormatter.ofPattern("MM")) + "1")

        val df = DecimalFormat("#.00")
        df.roundingMode = RoundingMode.HALF_UP
        val symbols = df.decimalFormatSymbols
        symbols.groupingSeparator = '\''
        symbols.decimalSeparator = '.'
        df.decimalFormatSymbols = symbols

        val duration = duration(timeController.getByDate(month))
        val amount = duration
                .zipWith(settingRepository.findById("hoursRate"),
                        { d: Double, hoursRate: Setting -> d * hoursRate.value.toDouble() })

        val totalHT = amount.map { d -> d + 0 }

        val tva = settingRepository.findById("tva")

        val totalTVA = totalHT.zipWith(tva, { total: Double, set: Setting -> total * set.value.toDouble() })

        val totalTTC = totalHT.zipWith(tva, { total: Double, set: Setting -> total * (1 + set.value.toDouble()) })

        model.addAttribute("duration", duration.map { d -> df.format(d) })
        model.addAttribute("amount", amount.map { d -> df.format(d) })
        model.addAttribute("totalHT", totalHT.map { d -> df.format(d) })
        model.addAttribute("totalTVA", totalTVA.map { d -> df.format(d) })
        model.addAttribute("totalTTC", totalTTC.map { d -> df.format(d) })
        model.addAttribute("client", settingRepository.findById("client")
                .map { s -> s.value.split(',') })
        model.addAttribute("tva", tva.map { s -> s.value.toDouble() * 100 })
        model.addAttribute("iban", settingRepository.findById("iban"))
        model.addAttribute("compte", settingRepository.findById("compte"))
        model.addAttribute("numeroTVA", settingRepository.findById("numeroTVA"))
        model.addAttribute("society", settingRepository
                .findById("societe.adresse").map { s -> s.value.split(',') })

        return Mono.just("billing")
    }

    fun duration(times: Flux<Time>): Mono<Double> = times
            .groupBy { t: Time -> t.getDate() }
            .switchMap { group: GroupedFlux<LocalDate, Time> -> group.collectList() }
            .map { dayTimes: List<Time> -> getDuration(dayTimes) }
            .reduce { d1: Duration, d2: Duration -> d1.plus(d2) }
            .map { d -> d.toMinutes() / 60.0 }

    private fun getDuration(times: List<Time>): Duration {
        val totalDuration = Duration.ZERO
        val counter = AtomicInteger(0)
        times.stream().collect(
                Collectors.groupingBy<Time, Int> { item ->
                    val i = counter.getAndIncrement()
                    if (i % 2 == 0) i else i - 1
                })
                .values
                .filter { pair: MutableList<Time> -> pair.size > 1 }
                .map { pair: MutableList<Time> -> Duration.between(pair[0].time, pair[1].time) }
                .forEach { duration: Duration -> totalDuration.plus(duration) }

        return totalDuration
    }
}
