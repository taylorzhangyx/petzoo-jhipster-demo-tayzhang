package com.taylorzhangyx.bugtracker.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LabelTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Label getLabelSample1() {
        return new Label().id(1L).label("label1").desc("desc1").fakeNumber(1).someFaker("someFaker1");
    }

    public static Label getLabelSample2() {
        return new Label().id(2L).label("label2").desc("desc2").fakeNumber(2).someFaker("someFaker2");
    }

    public static Label getLabelRandomSampleGenerator() {
        return new Label()
            .id(longCount.incrementAndGet())
            .label(UUID.randomUUID().toString())
            .desc(UUID.randomUUID().toString())
            .fakeNumber(intCount.incrementAndGet())
            .someFaker(UUID.randomUUID().toString());
    }
}
