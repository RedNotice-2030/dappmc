<aside class="ru-monitor ru-reveal" data-monitor>
    <div class="ru-monitor-head">
        <span><i></i> Patient experience monitor</span>
        <button type="button" aria-label="Refresh monitor" data-refresh-ratings>↻</button>
    </div>

    <div class="ru-monitor-body">
        <p class="ru-monitor-label">Composite score</p>
        <div class="ru-monitor-score"><span data-monitor-average>–.–</span><small>/ 5</small></div>
        <div class="ru-monitor-stars" data-star-display="monitor"></div>
        <p class="ru-monitor-sub"><span data-monitor-count>0</span> surveys on file</p>

        <svg class="ru-ecg" viewBox="0 0 900 92" aria-hidden="true" preserveAspectRatio="none">
            <path d="M0 46 H80 Q92 32 104 46 H128 L138 56 L148 12 L160 76 L170 46 H270 Q290 26 310 46 H410 H480 Q492 32 504 46 H528 L538 56 L548 12 L560 76 L570 46 H670 Q690 26 710 46 H900" />
            <path class="ru-ecg-live" d="M0 46 H80 Q92 32 104 46 H128 L138 56 L148 12 L160 76 L170 46 H270 Q290 26 310 46 H410 H480 Q492 32 504 46 H528 L538 56 L548 12 L560 76 L570 46 H670 Q690 26 710 46 H900" />
        </svg>

        <div class="ru-monitor-block">
            <p class="ru-monitor-label">Score distribution</p>
            <?php for ($star = 5; $star >= 1; $star--): ?>
                <div class="ru-dist-row">
                    <span><?= $star ?>★</span>
                    <b><i data-dist-bar="<?= $star ?>"></i></b>
                    <em data-dist-count="<?= $star ?>">0</em>
                </div>
            <?php endfor; ?>
        </div>

        <div class="ru-category-grid">
            <div class="ru-category"><span>Care team</span><b data-category-label="staffRating">–.–</b><i><u data-category-bar="staffRating"></u></i></div>
            <div class="ru-category"><span>Cleanliness</span><b data-category-label="cleanlinessRating">–.–</b><i><u data-category-bar="cleanlinessRating"></u></i></div>
            <div class="ru-category"><span>Wait time</span><b data-category-label="waitRating">–.–</b><i><u data-category-bar="waitRating"></u></i></div>
            <div class="ru-category"><span>Communication</span><b data-category-label="communicationRating">–.–</b><i><u data-category-bar="communicationRating"></u></i></div>
        </div>

        <p class="ru-monitor-sync">LAST SYNC <span data-last-sync>AWAITING FIRST SYNC</span> · SOURCE: /api/ratings</p>
    </div>
</aside>