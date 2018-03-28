package ch.focusit.reporting.endpoint

import ch.focusit.reporting.domain.Activity
import ch.focusit.reporting.domain.ActivityType
import ch.focusit.reporting.repository.ActivityRepository
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.reactive.server.WebTestClient
import reactor.core.publisher.Mono
import java.time.Duration
import java.time.LocalDate

@ExtendWith(SpringExtension::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ActivityControllerIT {

    @Autowired
    lateinit var repository: ActivityRepository

    private lateinit var webClient: WebTestClient

    @BeforeEach
    fun setUp() {
        webClient = WebTestClient.bindToController(ActivityController(repository)).build()

        repository.save(TEST_ACTIVITY_4).subscribe()
        repository.save(TEST_ACTIVITY_1).subscribe()
    }

    @AfterEach
    fun tearDown() {
        repository.deleteAll().subscribe()
    }

    @Test
    fun `find all`() {
        webClient.get()
                .uri("/activities/").accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk
                .expectBody()
                .jsonPath("$[0].date").isEqualTo(TEST_ACTIVITY_1.date)
                .jsonPath("$[1].date").isEqualTo(TEST_ACTIVITY_4.date)
    }

    @Test
    fun `insert time`() {
        val newActivity = Activity(LocalDate.parse("2018-03-26"), Duration.parse("PT6H15M"))
        val activityInserted = webClient.post().uri("/activities/").accept(MediaType.APPLICATION_JSON_UTF8)
                .syncBody(newActivity)
                .exchange()
                .expectStatus().isCreated
                .expectBody(Activity::class.java)
                .returnResult().responseBody

        Assertions.assertThat(activityInserted).isEqualToComparingFieldByField(newActivity)
    }

    @Test
    fun `find time by id`() {
        val founded = webClient.get()
                .uri("/activities/{date}", TEST_ACTIVITY_1.date).accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk
                .expectBody(Activity::class.java)
                .returnResult().responseBody

        Assertions.assertThat(founded).isEqualTo(TEST_ACTIVITY_1)
    }

    @Test
    fun `update time`() {
        val updateActivity = Activity(TEST_ACTIVITY_1.date, Duration.parse("PT9H45M"))
        val updated = webClient.put()
                .uri("/activities/{date}", TEST_ACTIVITY_1.date).accept(MediaType.APPLICATION_JSON)
                .syncBody(updateActivity)
                .exchange()
                .expectStatus().isOk
                .expectBody(Activity::class.java)
                .returnResult().responseBody

        Assertions.assertThat(updated).isEqualTo(updateActivity)
    }

    @Test
    fun `delete time`() {
        webClient.delete()
                .uri("/activities/{date}", TEST_ACTIVITY_1.date).accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk

        val empty: Mono<Activity> = Mono.empty()

        Assertions.assertThat(repository.findByDate(TEST_ACTIVITY_1.date)).isEqualTo(empty)
    }

    @Test
    fun `find by month`() {
        repository.save(TEST_ACTIVITY_2).subscribe()
        repository.save(TEST_ACTIVITY_3).subscribe()
        repository.save(TEST_ACTIVITY_5).subscribe()
        repository.save(TEST_ACTIVITY_6).subscribe()

        webClient.get()
                .uri("/activities/month/{month}", "2018-03").accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk
                .expectBody()
                .jsonPath("$[0].date").isEqualTo(TEST_ACTIVITY_1.date)
                .jsonPath("$[1].date").isEqualTo(TEST_ACTIVITY_2.date)
                .jsonPath("$[2].date").isEqualTo(TEST_ACTIVITY_3.date)
    }

    @Test
    fun `find by day`() {
        repository.save(TEST_ACTIVITY_2).subscribe()
        repository.save(TEST_ACTIVITY_3).subscribe()
        repository.save(TEST_ACTIVITY_5).subscribe()
        repository.save(TEST_ACTIVITY_6).subscribe()

        webClient.get()
                .uri("/activities/date/{date}", "2018-04-02").accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk
                .expectBody()
                .jsonPath("$[0].date").isEqualTo(TEST_ACTIVITY_5.date)
                .jsonPath("$[1].date").isEqualTo(TEST_ACTIVITY_6.date)
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