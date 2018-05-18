package ch.focusit.reporting.endpoint

import ch.focusit.reporting.domain.Setting
import ch.focusit.reporting.domain.Time
import ch.focusit.reporting.repository.SettingRepository
import ch.focusit.reporting.repository.TimeRepository
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.ui.ExtendedModelMap
import org.springframework.ui.Model
import reactor.test.StepVerifier
import java.time.Duration
import java.time.LocalDateTime
import java.time.YearMonth

@ExtendWith(SpringExtension::class)
@SpringBootTest
class BillingControllerTest {

    @Autowired
    lateinit var repository: TimeRepository

    @Autowired
    lateinit var settingRepository: SettingRepository

    @Autowired
    lateinit var billingController: BillingController

    var model: Model = ExtendedModelMap()

    @BeforeEach
    fun setUp() {
        settingRepository.save(Setting("hoursRate", "10")).subscribe()
        settingRepository.save(Setting("tva", "0.01")).subscribe()
        settingRepository.save(Setting("client", "Client Content,Av. de Beauregard 45,9876 Villa")).subscribe()
        settingRepository.save(Setting("iban", "MON_IBAN")).subscribe()
        settingRepository.save(Setting("compte", "MON_COMPTE")).subscribe()
        settingRepository.save(Setting("numeroTVA", "1234567890")).subscribe()
        settingRepository.save(Setting("societe.adresse", "Happy Company,Ch. du bonheur,1234 Les Nuages")).subscribe()

        repository.save(Time("_1", LocalDateTime.parse("2018-03-01T10:20"))).subscribe()
        repository.save(Time("_2", LocalDateTime.parse("2018-03-01T14:50"))).subscribe()
        repository.save(Time("_3", LocalDateTime.parse("2018-03-01T17:00"))).subscribe()
        repository.save(Time("_4", LocalDateTime.parse("2018-03-02T10:10"))).subscribe()
        repository.save(Time("_5", LocalDateTime.parse("2018-03-02T18:10"))).subscribe()
        repository.save(Time("_6", LocalDateTime.parse("2018-01-01T08:10"))).subscribe()
        repository.save(Time("_7", LocalDateTime.parse("2018-01-01T18:10"))).subscribe()
    }

    @AfterEach
    fun tearDown() {
        repository.deleteAll().subscribe()
    }

    @Test
    fun getByMonth() {
        StepVerifier.create<Setting> { settingRepository.findById("tva") }
                .expectNext(Setting("tva", "0.01"))
                .expectComplete().verify(Duration.ofSeconds(5))

        val response = billingController.getByMonth(YearMonth.parse("2018-03"), model)

        Assertions.assertThat(response).isEqualTo("billing")

        val attributes = model.asMap()

        Assertions.assertThat(attributes["month"]).isEqualTo("mars")
        Assertions.assertThat(attributes["id"]).isEqualTo("218031")
//        StepVerifier.create<String> { attributes["duration"].toString() }.expectNext("10.50").verifyComplete()
//        StepVerifier.create<String> { attributes["amount"].toString() }.expectNext("105.00").verifyComplete()
//        StepVerifier.create<String> { attributes["totalHT"].toString() }.expectNext("105.00").verifyComplete()
//        StepVerifier.create<String> { attributes["totalTVA"].toString() }.expectNext("1.05").verifyComplete()
//        StepVerifier.create<String> { attributes["totalTTC"].toString() }.expectNext("106.05").verifyComplete()
//        StepVerifier.create<String> { attributes["client"].toString() }
//                .expectNext("Client Content").expectNext("Av. de Beauregard 45").expectNext("9876 Villa")
//                .verifyComplete()
//        StepVerifier.create<String> { attributes["tva"].toString() }.expectNext("1").expectComplete().verify(Duration.ofSeconds(5))
//        StepVerifier.create<String> { attributes["iban"].toString() }.expectNext("MON_IBAN").verifyComplete()
//        StepVerifier.create<String> { attributes["compte"].toString() }.expectNext("MON_COMPTE").verifyComplete()
//        StepVerifier.create<String> { attributes["numeroTVA"].toString() }.expectNext("1234567890").verifyComplete()
//        StepVerifier.create<String> { attributes["society"].toString() }
//                .expectNext("Happy Company").expectNext("Ch. du bonheur").expectNext("1234 Les Nuages")
//                .verifyComplete()
    }
}