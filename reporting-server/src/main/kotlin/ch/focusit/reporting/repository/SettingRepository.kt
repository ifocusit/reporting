package ch.focusit.reporting.repository

import ch.focusit.reporting.domain.Setting
import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface SettingRepository : ReactiveCrudRepository<Setting, String>
