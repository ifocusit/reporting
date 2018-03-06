@RestController
@RequestMapping("/api/v1/reporting")
class ReportingEndpoint {

    @GetMapping("/hello")
    fun hello(): Any {
        return "Hello world !"
    }
}