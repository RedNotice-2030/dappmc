<?php
$departments = $departments ?? [];
$categories = [
    'staffRating' => 'Care team',
    'cleanlinessRating' => 'Cleanliness',
    'waitRating' => 'Wait time',
    'communicationRating' => 'Communication',
];
?>
<div class="ru-modal-shell ru-hidden" data-rate-modal aria-hidden="true">
    <div class="ru-modal-backdrop" data-close-rate-modal></div>
    <section class="ru-modal" role="dialog" aria-modal="true" aria-labelledby="rate-modal-title" tabindex="-1">
        <header class="ru-modal-head">
            <div>
                <p data-modal-kicker>Step 1 / 3 — Score</p>
                <h2 id="rate-modal-title" data-modal-title>How did we do?</h2>
            </div>
            <button type="button" aria-label="Close rating form" data-close-rate-modal>×</button>
        </header>

        <div class="ru-progress" aria-hidden="true">
            <span data-progress="0"></span><span data-progress="1"></span><span data-progress="2"></span>
        </div>

        <div class="ru-modal-body">
            <div class="ru-modal-step" data-modal-step="0">
                <div class="ru-field-card">
                    <label class="ru-label">Overall visit</label>
                    <div class="ru-star-input ru-star-input-large" data-star-input="overall" aria-label="Overall visit rating">
                        <?php for ($i = 1; $i <= 5; $i++): ?>
                            <button type="button" data-star-value="<?= $i ?>" aria-label="<?= $i ?> stars">★</button>
                        <?php endfor; ?>
                        <strong data-star-label="overall">Tap to score</strong>
                    </div>
                </div>

                <label class="ru-label">By area — optional, but it helps the right team</label>
                <div class="ru-category-inputs">
                    <?php foreach ($categories as $key => $label): ?>
                        <div>
                            <span><?= esc($label) ?></span>
                            <div class="ru-star-input" data-star-input="<?= esc($key) ?>" aria-label="<?= esc($label) ?> rating">
                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                    <button type="button" data-star-value="<?= $i ?>" aria-label="<?= $i ?> stars">★</button>
                                <?php endfor; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="ru-modal-step ru-hidden" data-modal-step="1">
                <label class="ru-label">Department visited</label>
                <div class="ru-department-grid" data-department-grid>
                    <?php foreach ($departments as $department): ?>
                        <button type="button" data-department="<?= esc($department) ?>"><?= esc($department) ?></button>
                    <?php endforeach; ?>
                </div>

                <div class="ru-form-grid ru-form-grid-one">
                    <label>
                        <span class="ru-label">Date of visit</span>
                        <input type="date" name="visitDate" data-field="visitDate" max="<?= date('Y-m-d') ?>">
                    </label>
                </div>

                <label>
                    <span class="ru-label">In your own words <em>(optional)</em></span>
                    <textarea name="comment" data-field="comment" maxlength="600" rows="4" placeholder="What should the ward team keep doing — or stop doing?"></textarea>
                    <small><span data-comment-count>0</span>/600</small>
                </label>

                <div>
                    <span class="ru-label">Would you recommend us?</span>
                    <div class="ru-choice-row" data-recommend-row>
                        <button type="button" data-recommend="true">Yes</button>
                        <button type="button" data-recommend="null">Rather not say</button>
                        <button type="button" data-recommend="false">No</button>
                    </div>
                </div>
            </div>

            <div class="ru-modal-step ru-hidden" data-modal-step="2">
                <div class="ru-summary-card">
                    <strong data-summary-department>Department</strong>
                    <span data-summary-date>Date</span>
                    <span data-summary-stars></span>
                </div>

                <div class="ru-form-grid">
                    <label>
                        <span class="ru-label">Name <em>(optional)</em></span>
                        <input type="text" name="patientName" data-field="patientName" maxlength="100" placeholder="Anonymous is fine">
                    </label>
                    <label>
                        <span class="ru-label">Email <em>(optional)</em></span>
                        <input type="email" name="email" data-field="email" maxlength="150" placeholder="For our written reply" autocomplete="@gmail.com">
                    </label>
                </div>

                <p class="ru-note">Surveys join the ward ledger instantly and are read, unedited, at Monday's quality round.</p>
            </div>

            <div class="ru-modal-step ru-hidden ru-success" data-modal-step="3">
                <div class="ru-success-mark">✓</div>
                <h3>On the ward ledger.</h3>
                <p>Your survey was saved under reference</p>
                <strong data-success-reference>SA-0000</strong>
                <small data-success-meta></small>
            </div>

            <p class="ru-form-error ru-hidden" data-form-error></p>
        </div>

        <footer class="ru-modal-foot">
            <button type="button" class="ru-btn ru-btn-ghost ru-hidden" data-modal-back>← Back</button>
            <span class="ru-foot-hint" data-modal-hint>Takes under a minute</span>
            <button type="button" class="ru-btn ru-btn-primary" data-modal-next>Continue →</button>
            <button type="button" class="ru-btn ru-btn-primary ru-hidden" data-modal-submit>★ Submit my rating</button>
            <button type="button" class="ru-btn ru-btn-primary ru-hidden" data-modal-done data-close-rate-modal>Done</button>
        </footer>
    </section>
</div>

<div class="ru-toast ru-hidden" data-rate-toast>
    <button type="button" aria-label="Dismiss rating prompt" data-dismiss-toast>×</button>
    <div>★★★★<span>★</span></div>
    <strong>Were you in our care recently?</strong>
    <p>Sixty seconds puts your visit on the ward ledger — read by real people every Monday.</p>
    <button type="button" class="ru-btn ru-btn-primary" data-open-rate-modal>Rate your visit</button>
</div>