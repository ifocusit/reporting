package ch.focusit.reporting.endpoint

import ch.focusit.reporting.domain.Activity
import ch.focusit.reporting.domain.ActivityType
import ch.focusit.reporting.repository.ActivityRepository
import ch.focusit.test.tools.MockitoExtension
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentCaptor
import org.mockito.Captor
import org.mockito.Mock
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.ui.Model
import reactor.core.publisher.Mono
import reactor.test.StepVerifier
import java.time.Duration
import java.time.LocalDate
import java.time.YearMonth

@ExtendWith(SpringExtension::class, MockitoExtension::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BillingControllerTest {

    @Autowired
    lateinit var repository: ActivityRepository

    lateinit var billingController: BillingController

    @Mock
    lateinit var model: Model

    @Captor
    lateinit var captorAttrNames: ArgumentCaptor<String>
    @Captor
    lateinit var captorAttrValues: ArgumentCaptor<Object>

    @BeforeEach
    fun setUp() {
        billingController = (BillingController(ActivityController(repository)))
        repository.save(TEST_ACTIVITY_1).subscribe()
        repository.save(TEST_ACTIVITY_2).subscribe()
        repository.save(TEST_ACTIVITY_3).subscribe()
        repository.save(TEST_ACTIVITY_4).subscribe()
        repository.save(TEST_ACTIVITY_5).subscribe()
        repository.save(TEST_ACTIVITY_6).subscribe()
    }

    @AfterEach
    fun tearDown() {
        repository.deleteAll().subscribe()
    }

    @Test
    fun getByMonth() {
        val totalDurationExpected = TEST_ACTIVITY_1.duration?.plus(TEST_ACTIVITY_2.duration)
        val month = YearMonth.parse("2018-03")

        StepVerifier.create(billingController.getByMonth(month, model))
                .expectNext("billing")
                .expectComplete()

        Mockito.verify(model, Mockito.times(3)).addAttribute(captorAttrNames.capture(), captorAttrValues.capture())

        Assertions.assertThat(captorAttrValues.allValues.get(0)).isSameAs(month)
        Assertions.assertThat(captorAttrValues.allValues.get(1)).isEqualTo("2018011")
        Assertions.assertThat(captorAttrValues.allValues.get(2)).isEqualTo(Mono.just(totalDurationExpected))
    }

    companion object {
        val TEST_ACTIVITY_1 = Activity(LocalDate.parse("2018-03-01"), Duration.ofHours(6L))
        val TEST_ACTIVITY_2 = Activity(LocalDate.parse("2018-03-02"), Duration.ofHours(5L))
        val TEST_ACTIVITY_3 = Activity(LocalDate.parse("2018-03-02"), null, ActivityType.OFF)
        val TEST_ACTIVITY_4 = Activity(LocalDate.parse("2018-04-01"), Duration.ofHours(8L))
        val TEST_ACTIVITY_5 = Activity(LocalDate.parse("2018-04-02"), Duration.ofHours(4L))
        val TEST_ACTIVITY_6 = Activity(LocalDate.parse("2018-04-02"), null, ActivityType.OFF)
    }
}