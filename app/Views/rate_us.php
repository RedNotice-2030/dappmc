    <?php
        $departments = $departments ?? [];
        $initialData = $initialData ?? ['stats' => null, 'reviews' => []];
        $csrf = $csrf ?? ['tokenName' => null, 'headerName' => 'X-CSRF-TOKEN', 'hash' => null];

        $config = [
            'apiUrl'      => site_url('api/ratings'),
            'departments' => $departments,
            'initialData' => $initialData,
            'csrf'        => $csrf,
            'today'       => date('Y-m-d'),
        ];
        ?>

    
    <?= view('partials/header', ['title' => 'DAPPMC - Rate Us']) ?>


    <body>
    <script type="application/json" id="rate-us-config">
        <?= json_encode($config, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>
    </script>

    <main id="top">
        <section class="ru-hero ru-cross-grid">
            <div class="ru-container ru-hero-grid">
                <div class="ru-reveal">
                    <p class="ru-kicker">⌁ Feedback · live ledger</p>
                    <h1>Care worth putting <em>on the record.</em></h1>
                    <p class="ru-lead">
                        Every visit to DAPPMC ends with an open question: <strong>how did we do?</strong>
                        Your rating gets reviewed weekly.
                    </p>
                    <div class="ru-actions">
                        <button type="button" class="ru-btn ru-btn-primary" data-open-rate-modal>Rate your visit →</button>
                        <a class="ru-btn ru-btn-ghost" href="#wall">Browse feedback wall</a>
                    </div>
                    <div class="ru-hero-stats">
                        <span data-hero-average>–.–</span>
                        <span data-star-display="hero"></span>
                        <span><b data-hero-count>0</b> surveys filed</span>
                    </div>
                </div>

                <?= $this->include('rate_us/partials/monitor') ?>
            </div>
        </section>

        <section id="promise" class="ru-section ru-section-muted">
            <div class="ru-container ru-two-col">
                <div class="ru-reveal">
                    <p class="ru-kicker">The ledger rules</p>
                    <h2>What happens to your feedback</h2>
                    <br>
                    <p class="ru-muted-text">A rating box is only as honest as the pipeline behind it. These commitments are printed and reviewed weekly.</p>
                </div>
                <div class="ru-promise-list">
                    <article class="ru-reveal"><span>01</span>
                        <div>
                            <h3>Logged instantly</h3>
                            <p>Your survey lands in the database the moment you submit. Low scores can be flagged for immediate review.</p>
                        </div>
                    </article>
                    <!-- <article class="ru-reveal"><span>02</span>
                        <div>
                            <h3>Read at quality round</h3>
                            <p>Ward leads review every comment, unedited, during the weekly quality meeting.</p>
                        </div>
                    </article> -->
                    <article class="ru-reveal"><span>02</span>
                        <div>
                            <h3>Reply within five working days</h3>
                            <p>Leave an email and a member of the patient experience team can respond personally.</p>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section id="wall" class="ru-section">
            <div class="ru-container">
                <div class="ru-section-head ru-reveal">
                    <div>
                        <p class="ru-kicker">Fresh from the ledger</p>
                        <h2>The feedback wall</h2>
                    </div>
                    <div class="ru-wall-totals">
                        <div><strong data-wall-average>–.–</strong><span>average</span></div>
                        <div><strong data-wall-count>0</strong><span>surveys filed</span></div>
                    </div>
                </div>

                <div class="ru-alert ru-hidden" data-error-box>
                    The ledger did not answer. Check your connection and try again.
                    <button type="button" data-refresh-ratings>Retry</button>
                </div>

                <div class="ru-review-grid" data-review-list></div>

                <div class="ru-empty ru-hidden" data-empty-wall>
                    <h3>The wall is waiting for its first voice.</h3>
                    <p>Yours could set the tone — sixty seconds, straight onto the ledger.</p>
                    <button type="button" class="ru-btn ru-btn-primary" data-open-rate-modal>Be the first</button>
                </div>

                <div class="ru-wall-cta ru-reveal">
                    <h3>Recently discharged? The ledger has room for one more line.</h3>
                    <p>It takes under a minute, and the ward team reads every single entry.</p>
                    <button type="button" class="ru-btn ru-btn-primary" data-open-rate-modal>★ Rate your visit</button>
                </div>
            </div>
        </section>
    </main>


    <?= view('partials/footer') ?>
    <?= $this->include('rate_us/partials/modal') ?>
    <?= $this->include('rate_us/partials/review_card') ?>

    <script src="<?= esc(base_url('assets/rate-us/js/rate-us.js')) ?>" defer></script>
</body>

</html>