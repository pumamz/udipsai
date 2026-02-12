package com.ucacue.udipsai.common.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    private static final String RESET = "\u001B[0m";
    private static final String GREEN = "\u001B[32m";
    private static final String CYAN = "\u001B[36m";
    private static final String RED = "\u001B[31m";
    private static final String MAGENTA = "\u001B[35m";

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerPointcut() {
    }

    @Pointcut("within(@org.springframework.stereotype.Service *)")
    public void servicePointcut() {
    }

    @Pointcut("within(com.ucacue.udipsai.modules..*) || within(com.ucacue.udipsai.infrastructure..*)")
    public void applicationPackagePointcut() {
    }

    @Around("controllerPointcut() && applicationPackagePointcut()")
    public Object logControllerAccess(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        log.info("{}>>> API Request: {}.{}{}", CYAN, className, methodName, RESET);

        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - start;
            log.info("{}<<< API Response: {}.{} executed in {}ms{}", CYAN, className, methodName, executionTime, RESET);
            return result;
        } catch (Exception e) {
            log.error("{}!!! API Error in {}.{}: {}{}", RED, className, methodName, e.getMessage(), RESET);
            throw e;
        }
    }

    @Around("servicePointcut() && applicationPackagePointcut()")
    public Object logServiceAccess(ProceedingJoinPoint joinPoint) throws Throwable {
        if (!log.isDebugEnabled()) {
            return joinPoint.proceed();
        }

        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        log.debug("{}[Service] Enter: {}.{}{}", GREEN, className, methodName, RESET);
        try {
            Object result = joinPoint.proceed();
            log.debug("{}[Service] Exit: {}.{}{}", GREEN, className, methodName, RESET);
            return result;
        } catch (Throwable e) {
            log.debug("{}[Service] Exception in {}.{}: {}{}", MAGENTA, className, methodName, e.getMessage(), RESET);
            throw e;
        }
    }
}
