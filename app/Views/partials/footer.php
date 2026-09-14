<footer class="text-white pt-5 pb-3" style="background-color: #002c6d">
      <div class="container">
        <div class="row g-4 border-bottom border-secondary pb-4">
          <div class="col-md-4">
            <h5 class="foot-font fw-bold mb-3" style="color: #c6b350">DAPPMC</h5>
            <p class="small foot-font fw-bold" style="color: #c6b350">Integrity, Compassion, Accountability, Reliability, and Excellence</p>
          </div>
          <div class="col-md-4">
            <h5 class="foot-font fw-bold mb-3">Quick Links</h5>
            <ul class="list-unstyled small">
              <li><a href="tel:(083) 228 2202" class="text-decoration-none" style="color: #c6b350">Emergency Care</a></li>
              <li><a href="<?= site_url('doctors') ?>" class="text-decoration-none" style="color: #c6b350">Find a Physician</a></li>
              <li><a href="#" class="text-decoration-none" style="color: #c6b350">Patient Portal</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5 class="foot-font fw-bold mb-3">Working Hours</h5>
            <p class="small mb-1" style="color: #c6b350">Emergency: <strong>24/7 - (083) 228 2202</strong></p>
            <p class="small" style="color: #c6b350">Outpatient Clinic: Mon - Sat (8:00 AM - 6:00 PM)</p>
          </div>
        </div>
        <div class="text-center small pt-3" style="color: #c6b350">&copy; 2026 Dr. Arturo P. Pingoy Medical Center. All rights reserved.</div>
      </div>
    </footer>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    <script src="<?= base_url('assets/js/partials.js') ?>"></script>
    <script src="<?= base_url('assets/js/csrf.js') ?>"></script>
    <script src="<?= base_url('assets/js/careers.js') ?>"></script>
    <script src="<?= base_url('assets/js/style.js') ?>"></script>
    <script>
    window.difyChatbotConfig = {
      token: 'x3aKkUmDhLLqYUkw',
      baseUrl: 'https://udify.app',
      inputs: {
        // You can define the inputs from the Start node here
        // key is the variable name
        // e.g.
        // name: "NAME"
      },
      systemVariables: {
        // user_id: 'YOU CAN DEFINE USER ID HERE',
        // conversation_id: 'YOU CAN DEFINE CONVERSATION ID HERE, IT MUST BE A VALID UUID',
      },
      userVariables: {
        // avatar_url: 'YOU CAN DEFINE USER AVATAR URL HERE',
        // name: 'YOU CAN DEFINE USER NAME HERE',
      },
    }
    </script>
    <script
    src="https://udify.app/embed.min.js"
    id="x3aKkUmDhLLqYUkw"
    defer>
    </script>
    <style>
      #dify-chatbot-bubble-button {
        background-color: #1C64F2 !important;
      }
      #dify-chatbot-bubble-window {
        width: 24rem !important;
        height: 40rem !important;
      }
    </style>
    <!-- jQuery (Required by Toastr) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Toastr JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script src="<?= base_url('assets/js/chat-widget.js') ?>?v=5"></script>
    <?php if (isset($extraScripts)): ?>
      <?= $extraScripts ?>
    <?php endif; ?>
    <script src="<?= base_url('assets/js/script.js') ?>?v=2"></script>

    <!-- Global Modals (Contact + Privacy) -->
    <?= view('partials/modals') ?>
  </body>
</html>