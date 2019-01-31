package ch.focusit.reporting.infra.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter


@Configuration
@EnableWebSecurity
class SecurityConfiguration : WebSecurityConfigurerAdapter() {

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http
                .cors().and().csrf().disable()
                .authorizeRequests().anyRequest().permitAll()
//                .authenticated().and().oauth2Login()
    }

    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        config.allowCredentials = true
        config.addAllowedOrigin("*")
        config.addAllowedHeader("*")
        config.addAllowedMethod("*")
        source.registerCorsConfiguration("/**", config)
        return CorsFilter(source)
    }

//fun corsConfigurationSource(): CorsConfigurationSource {
//    val configuration = CorsConfiguration()
//    configuration.addAllowedOrigin("*")
//    configuration.allowedMethods = Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH")
//    // setAllowCredentials(true) is important, otherwise:
//    // The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
//    configuration.allowCredentials = true
//    // setAllowedHeaders is important! Without it, OPTIONS preflight request
//    // will fail with 403 Invalid CORS request
//    configuration.allowedMethods = Arrays.asList("Authorization", "Cache-Control", "Content-Type")
//    val source = UrlBasedCorsConfigurationSource()
//    source.registerCorsConfiguration("/**", configuration)
//    return source
//}

}
