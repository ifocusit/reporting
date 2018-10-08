package ch.focusit.reporting.infra.security

import org.springframework.lang.Nullable
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("user")
class UserController {

    @GetMapping
    fun findAll(@Nullable principal: Principal) = principal
}