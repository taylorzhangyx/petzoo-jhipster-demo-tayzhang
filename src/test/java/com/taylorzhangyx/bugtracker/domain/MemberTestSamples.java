package com.taylorzhangyx.bugtracker.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class MemberTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Member getMemberSample1() {
        return new Member().id(1L).nickName("nickName1");
    }

    public static Member getMemberSample2() {
        return new Member().id(2L).nickName("nickName2");
    }

    public static Member getMemberRandomSampleGenerator() {
        return new Member().id(longCount.incrementAndGet()).nickName(UUID.randomUUID().toString());
    }
}
