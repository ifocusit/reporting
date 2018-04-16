package ch.focusit.reporting.endpoint

import ch.focusit.reporting.domain.Activity
import ch.focusit.reporting.domain.Setting
import ch.focusit.reporting.repository.SettingRepository
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.math.RoundingMode
import java.text.DecimalFormat
import java.time.Duration
import java.time.YearMonth
import java.time.format.DateTimeFormatter

@Controller
@CrossOrigin("*")
@RequestMapping("billing")
class BillingController(val activityController: ActivityController, val settingRepository: SettingRepository) {

    @GetMapping("/generate/{month}")
    fun getByMonth(@PathVariable(value = "month") month: YearMonth, model: Model): String {
        model.addAttribute("month", month.format(DateTimeFormatter.ofPattern("MMMM")))
        model.addAttribute("id", month.year.toString().replaceFirst("20", "2") +
                month.format(DateTimeFormatter.ofPattern("MM")) + "1")

        val df = DecimalFormat("#.00")
        df.roundingMode = RoundingMode.HALF_UP
        val symbols = df.decimalFormatSymbols
        symbols.groupingSeparator = '\''
        symbols.decimalSeparator = '.'
        df.decimalFormatSymbols = symbols

        val duration = duration(activityController.getByMonth(month))
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
        model.addAttribute("society", settingRepository.findById("societe.adresse")
                .map { s -> s.value.split(',') })

        return "billing"
    }

    fun duration(activities: Flux<Activity>): Mono<Double> = activities
            .filter({ d -> d.duration != null })
            .map { activity -> activity.duration!! }
            .reduce { d1: Duration, d2: Duration -> d1.plus(d2) }
            .map { d -> d.toMinutes() / 60.0 }
}
