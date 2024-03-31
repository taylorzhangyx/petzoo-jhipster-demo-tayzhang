package com.taylorzhangyx.bugtracker.domain;

import static com.taylorzhangyx.bugtracker.domain.ProjectTestSamples.*;
import static com.taylorzhangyx.bugtracker.domain.TeamTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.taylorzhangyx.bugtracker.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class TeamTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Team.class);
        Team team1 = getTeamSample1();
        Team team2 = new Team();
        assertThat(team1).isNotEqualTo(team2);

        team2.setId(team1.getId());
        assertThat(team1).isEqualTo(team2);

        team2 = getTeamSample2();
        assertThat(team1).isNotEqualTo(team2);
    }

    @Test
    void productTest() throws Exception {
        Team team = getTeamRandomSampleGenerator();
        Project projectBack = getProjectRandomSampleGenerator();

        team.addProduct(projectBack);
        assertThat(team.getProducts()).containsOnly(projectBack);
        assertThat(projectBack.getOwner()).isEqualTo(team);

        team.removeProduct(projectBack);
        assertThat(team.getProducts()).doesNotContain(projectBack);
        assertThat(projectBack.getOwner()).isNull();

        team.products(new HashSet<>(Set.of(projectBack)));
        assertThat(team.getProducts()).containsOnly(projectBack);
        assertThat(projectBack.getOwner()).isEqualTo(team);

        team.setProducts(new HashSet<>());
        assertThat(team.getProducts()).doesNotContain(projectBack);
        assertThat(projectBack.getOwner()).isNull();
    }
}
