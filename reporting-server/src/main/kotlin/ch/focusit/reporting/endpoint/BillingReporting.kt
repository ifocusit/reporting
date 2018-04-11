package ch.focusit.reporting.endpoint

import ch.focusit.reporting.domain.Activity
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import reactor.core.publisher.Flux
import java.time.Duration
import java.time.YearMonth
import java.time.format.DateTimeFormatter


@Controller
@CrossOrigin(value = "*")
@RequestMapping("billing")
class BillingController(val activityController: ActivityController) {

    @GetMapping("/generate/{month}")
    fun getByMonth(@PathVariable(value = "month") month: YearMonth, model: Model): String {
        model.addAttribute("month", month.format(DateTimeFormatter.ofPattern("MMMM")))
        model.addAttribute("id", month.year.toString().replaceFirst("20", "2") + "011")

        val duration = duration(activityController.getByMonth(month))
        val amount = duration.map { d -> 145 * d!! }
        val totalHT = amount
        val totalTVA = totalHT.map { v -> v!! * 0.077 }
        val totalTTC = totalHT.map { v -> v!! * 1.077 }

        model.addAttribute("duration", duration)
        model.addAttribute("amount", amount)
        model.addAttribute("totalHT", totalHT)
        model.addAttribute("totalTVA", totalTVA)
        model.addAttribute("totalTTC", totalTTC)

        return "billing"
    }

    fun duration(activities: Flux<Activity>) = activities
            .filter({ d -> d.duration != null })
            .map { activity -> activity.duration!! }
            .reduce { d1: Duration, d2: Duration -> d1.plus(d2) }
            .map { d -> d.toMinutes() / 60.0 }
}
