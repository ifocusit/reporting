package ch.focusit.reporting

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@SpringBootTest
class ReportingApplicationIT {

    @Test
    fun contextLoads() {
    }

//    @Autowired
//    lateinit var testRestTemplate: TestRestTemplate
//
//    @Test
//    fun whenCalled_thenShouldReturnHello() {
//        val result = testRestTemplate.withBasicAuth("user", "pass")
//                .getForEntity("/time/hello", String::class.java)
//
//        assertNotNull(result)
//        assertEquals(HttpStatus.OK, result?.statusCode)
//        assertEquals("hello world", result?.body)
//    }
}
