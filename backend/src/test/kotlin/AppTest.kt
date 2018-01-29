import org.junit.Test;
import static org.junit.Assert.*;

class AppTest {
    @Test fun testAppHasAGreeting() {
        App classUnderTest = new App();
        assertNotNull("app should have a greeting", classUnderTest.getGreeting());
    }
}
