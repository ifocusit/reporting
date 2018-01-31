package ch.focusit.reporting.endpoint

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class ReportingEndpoint {

    @RequestMapping("/answer")
    fun answer() = 42
}
