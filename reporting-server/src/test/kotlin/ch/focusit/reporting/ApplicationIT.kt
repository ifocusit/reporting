package ch.focusit.reporting

import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@SpringBootTest
class ApplicationIT {

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
