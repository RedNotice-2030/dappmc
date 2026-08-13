/**
 * DAPPMC Content Management System — Core Data Layer
 * 
 * This lightweight CMS lets you manage website content (news, packages, etc.)
 * without editing HTML code manually.
 * 
 * HOW IT WORKS:
 * 1. Content is stored in JSON files inside assets/data/
 * 2. Pages fetch and render this JSON dynamically via JavaScript
 * 3. The CMS admin panel (cms.html) lets you add/edit/delete content
 * 4. Changes are saved to localStorage (for immediate testing) and can be
 *    exported as JSON to update the data files permanently
 * 
 * USAGE (for developers):
 *   CMS.getData('news')                    -> loads news.json
 *   CMS.getData('packages')                -> loads packages.json
 *   CMS.saveItem('news', item)             -> adds/updates an item
 *   CMS.deleteItem('news', itemId)         -> deletes an item
 *   CMS.exportData('news')                 -> downloads news.json
 *   CMS.importData('news', jsonString)      -> replaces all data
 */
(function (window) {
  'use strict';

  var CMS = {
    STORAGE_PREFIX: 'dappmc-cms-',
    dataCache: {},

    // Embedded fallback data for local file:// testing (fetch is blocked by CORS)
    EMBEDDED_DATA: {
      news: {
        news: [
          {
            id: 'news-001',
            category: 'news',
            title: 'DAPPMC Opens New Outpatient Department',
            excerpt: 'We are proud to announce the opening of our newly renovated Outpatient Department to better serve our patients.',
            content: 'The Dr. Arturo P. Pingoy Medical Center is excited to announce the completion and opening of its newly renovated Outpatient Department. The new facility features modern examination rooms, improved waiting areas, and enhanced patient flow to reduce wait times.',
            image: '',
            date: '2026-07-15',
            tags: ['facility', 'announcement']
          },
          {
            id: 'news-002',
            category: 'news',
            title: 'DAPPMC Receives ISO Certification',
            excerpt: 'Our hospital has been awarded ISO 9001:2015 certification for quality management systems.',
            content: 'The Dr. Arturo P. Pingoy Medical Center has been awarded the prestigious ISO 9001:2015 certification for its quality management systems. This recognition reflects our commitment to providing exceptional healthcare services and continuous improvement.',
            image: '',
            date: '2026-06-20',
            tags: ['accreditation', 'quality']
          }
        ],
        advisories: [
          {
            id: 'adv-001',
            category: 'advisories',
            title: 'Dengue Prevention Advisory',
            excerpt: 'Practice the 4S strategy to prevent dengue: Search and destroy, Self-protection measures, Seek early consultation, and Say no to self-medication.',
            content: 'As part of our commitment to community health, DAPPMC reminds the public to practice the 4S strategy to prevent dengue. With the rainy season approaching, it is important to eliminate mosquito breeding sites and seek medical attention early if symptoms appear.',
            image: '',
            date: '2026-07-01',
            tags: ['dengue', 'prevention']
          }
        ],
        events: [
          {
            id: 'evt-001',
            category: 'events',
            title: 'Medical Mission 2026',
            excerpt: 'Join us for our annual free medical mission providing consultations, check-ups, and medicines for the community.',
            content: 'DAPPMC will be hosting its annual Medical Mission on December 5, 2026. Services include free consultations, blood pressure screening, blood sugar testing, and free medicines for indigent patients.',
            image: '',
            date: '2026-07-10',
            tags: ['medical mission', 'community']
          }
        ],
        drives: [
          {
            id: 'drv-001',
            category: 'drives',
            title: 'Blood Donation Drive',
            excerpt: 'Be a hero — donate blood and save lives. Walk-ins are welcome from 8am to 4pm.',
            content: 'DAPPMC, in partnership with the Philippine Red Cross, invites everyone to participate in our upcoming Blood Donation Drive. Donors will receive a free health screening and refreshments.',
            image: '',
            date: '2026-06-25',
            tags: ['blood donation', 'drive']
          }
        ],
        alerts: [
          {
            id: 'alt-001',
            category: 'alerts',
            title: 'COVID-19 Update',
            excerpt: 'Mask wearing is still encouraged for high-risk individuals and those with symptoms.',
            content: 'Following the latest DOH guidelines, DAPPMC continues to encourage mask-wearing for high-risk individuals, symptomatic patients, and visitors entering patient care areas.',
            image: '',
            date: '2026-07-05',
            tags: ['covid', 'safety']
          }
        ]
      },
      jobs: {
        jobs: [
          {
            id: 'job-001',
            title: 'PT Aide',
            type: 'Full-time',
            qualifications: [
              'NC-II in Health Care Holder',
              'Good organizational and coordination skills',
              'With or Without Experience'
            ],
            benefits: [
              'Competitive salary and comprehensive benefits package',
              'A supportive, collaborative, and people-friendly work environment',
              'Opportunities for professional development and continuous learning'
            ],
            active: true,
            sortOrder: 1
          },
          {
            id: 'job-002',
            title: 'Warehouse Staff',
            type: 'Full-time',
            qualifications: [
              'Graduate or undergraduate of any business course',
              'With experience of warehousing',
              'With initiative, must know how to use basic computer',
              'Strong personality, hardworking, honest and trustworthy',
              'Preferably Male'
            ],
            benefits: [
              'Competitive salary and comprehensive benefits package',
              'A supportive, collaborative, and people-friendly work environment',
              'Opportunities for professional development and continuous learning'
            ],
            active: true,
            sortOrder: 2
          },
          {
            id: 'job-003',
            title: 'Staff Nurse',
            type: 'Full-time',
            qualifications: [
              'Graduate of Bachelor of Science in Nursing (BSN)',
              'With or Without Experience',
              'Must be a licensed Registered Nurse (RN)',
              'Must be knowledgeable, competent, and has a positive attitude'
            ],
            benefits: [
              'Competitive salary and comprehensive benefits package',
              'A supportive, collaborative, and people-friendly work environment',
              'Opportunities for professional development and continuous learning'
            ],
            active: true,
            sortOrder: 3
          },
          {
            id: 'job-004',
            title: 'Aircon Technician',
            type: 'Full-time',
            qualifications: [
              'Graduate of Air Conditioning Technician Course or High School Graduate',
              'At least one (1) year related experience',
              'Preferably with TESDA Certificate of Training'
            ],
            benefits: [
              'Competitive salary and comprehensive benefits package',
              'A supportive, collaborative, and people-friendly work environment',
              'Opportunities for professional development and continuous learning'
            ],
            active: true,
            sortOrder: 4
          }
        ]
      },
      packages: {
        packages: [
          {
            id: 'pkg-001',
            name: "Women's Health Package",
            shortDescription: 'Includes Lipid Profile, Urinalysis, Pap Smear, 12-Lead ECG, and Breast Ultrasound.',
            fullDescription: "Avail our August Women's Health promo package valid until August 31, 2026 only.",
            image: 'assets/images/packages/whp1.jpg',
            promoBadge: '20% OFF',
            promoDetails: 'Promo valid Aug 1–31, 2026 · Cash transactions only',
            operatingHours: '8:00am to 5:00pm, Mondays to Fridays.',
            availmentSteps: [
              'Contact DAPPMC Information landline at 228-2202 or mobile number 09499946474.',
              'The information staff will assist your schedule and book accordingly.',
              'The information staff will provide preparation guidelines and ask for the PWD/Senior Citizen ID Number if the client is a PWD/Senior Citizen.'
            ],
            paymentOptions: [
              'Pay in cash',
              'Pay online via online banking payment schemes',
              'Pay through GCash or PayMaya',
              'Email the proof of payment to dchi.accounting@yahoo.com'
            ],
            active: true,
            sortOrder: 1
          },
          {
            id: 'pkg-002',
            name: 'Thyroid Health Package',
            shortDescription: 'Includes Neck Ultrasound, TSH, T3, and T4.',
            fullDescription: 'Avail our August Thyroid Health promo package valid until August 31, 2026 only.',
            image: 'assets/images/packages/thp1.jpg',
            promoBadge: '20% OFF',
            promoDetails: 'Promo valid Aug 1–31, 2026 · Cash transactions only',
            operatingHours: '8:00am to 5:00pm, Mondays to Fridays.',
            availmentSteps: [
              'Contact DAPPMC Information landline at 228-2202 or mobile number 09499946474.',
              'The information staff will assist your schedule and book accordingly.',
              'The information staff will provide preparation guidelines and ask for the PWD/Senior Citizen ID Number if the client is a PWD/Senior Citizen.'
            ],
            paymentOptions: [
              'Pay in cash',
              'Pay online via online banking payment schemes',
              'Pay through GCash or PayMaya',
              'Email the proof of payment to dchi.accounting@yahoo.com'
            ],
            active: true,
            sortOrder: 2
          },
          {
            id: 'pkg-003',
            name: 'Prostate Cancer Awareness Month',
            shortDescription: 'Package A: Includes Prostate Specific Antigen (PSA), Ultrasound of Prostate. Package B: Includes Prostate Specific Antigen (PSA), Ultrasound of KUB & Prostate',
            fullDescription: 'Avail our August promo package in celebration of Prostate Cancer Awareness Month valid until August 31, 2026 only.',
            image: 'assets/images/packages/pcam1.jpg',
            promoBadge: '20% OFF',
            promoDetails: 'Promo valid Aug 1–31, 2026 · Cash transactions only',
            operatingHours: '8:00am to 5:00pm, Mondays to Fridays.',
            availmentSteps: [
              'Contact DAPPMC Information landline at 228-2202 or mobile number 09499946474.',
              'The information staff will assist your schedule and book accordingly.',
              'The information staff will provide preparation guidelines and ask for the PWD/Senior Citizen ID Number if the client is a PWD/Senior Citizen.'
            ],
            paymentOptions: [
              'Pay in cash',
              'Pay online via online banking payment schemes',
              'Pay through GCash or PayMaya',
              'Email the proof of payment to dchi.accounting@yahoo.com'
            ],
            active: true,
            sortOrder: 3
          }
        ]
      },
      doctors: {
        doctors: [
          {
            id: 'doc-001',
            name: 'Dr. Juan Dela Cruz',
            specialization: 'cardiology',
            specializationLabel: 'Cardiology',
            location: 'Room 204, Heart Station',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Mon & Wed', time: '9:00 AM – 1:00 PM' },
              { days: 'Friday', time: '2:00 PM – 5:00 PM' }
            ],
            active: true,
            sortOrder: 1
          },
          {
            id: 'doc-002',
            name: 'Dr. Maria Santos',
            specialization: 'pediatrics',
            specializationLabel: 'Pediatrics',
            location: 'Room 102, Outpatient Dept.',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Tue & Thu', time: '10:00 AM – 3:00 PM' },
              { days: 'Saturday', time: '8:00 AM – 12:00 PM' }
            ],
            active: true,
            sortOrder: 2
          },
          {
            id: 'doc-003',
            name: 'Dr. Arthur Pendragon Jr.',
            specialization: 'radiology',
            specializationLabel: 'Radiology',
            location: 'CT Scan & Imaging Center',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Mon – Sat', time: '8:00 AM – 5:00 PM' }
            ],
            active: true,
            sortOrder: 3
          },
          {
            id: 'doc-004',
            name: 'Dr. Roberto Reyes',
            specialization: 'internal-medicine',
            specializationLabel: 'Internal Medicine',
            location: 'Room 301, Main Building',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Mon, Wed, Fri', time: '1:00 PM – 5:00 PM' }
            ],
            active: true,
            sortOrder: 4
          },
          {
            id: 'doc-005',
            name: 'Dr. Elena Ramos',
            specialization: 'physiology',
            specializationLabel: 'Physiology',
            location: 'Physical Medicine & Rehab',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Tue & Thu', time: '8:00 AM – 12:00 PM' }
            ],
            active: true,
            sortOrder: 5
          },
          {
            id: 'doc-006',
            name: 'Dr. Angela Fernandez',
            specialization: 'anesthesiology',
            specializationLabel: 'Anesthesiology',
            location: 'Operating Room Complex',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Mon – Fri', time: 'Surgical Schedule' }
            ],
            active: true,
            sortOrder: 6
          },
          {
            id: 'doc-007',
            name: 'Dr. Victor Mendoza',
            specialization: 'nephrology',
            specializationLabel: 'Nephrology',
            location: 'Dialysis Unit & Room 208',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Mon, Wed, Sat', time: '8:00 AM – 2:00 PM' }
            ],
            active: true,
            sortOrder: 7
          },
          {
            id: 'doc-008',
            name: 'Dr. Carlos Villanueva',
            specialization: 'urology',
            specializationLabel: 'Urology',
            location: 'Room 210, Medical Arts Bldg.',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Tue & Fri', time: '1:00 PM – 4:00 PM' }
            ],
            active: true,
            sortOrder: 8
          },
          {
            id: 'doc-009',
            name: 'Dr. Fernando Aquino',
            specialization: 'orthopedics',
            specializationLabel: 'Orthopedics',
            location: 'Room 105, Bone & Joint Clinic',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Mon & Thu', time: '10:00 AM – 3:00 PM' }
            ],
            active: true,
            sortOrder: 9
          },
          {
            id: 'doc-010',
            name: 'Dr. Patricia Alonzo',
            specialization: 'pulmonology',
            specializationLabel: 'Pulmonology',
            location: 'Pulmonary Care Unit',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Wed & Sat', time: '9:00 AM – 1:00 PM' }
            ],
            active: true,
            sortOrder: 10
          },
          {
            id: 'doc-011',
            name: 'Dr. Manuel Soriano',
            specialization: 'ent',
            specializationLabel: 'ENT (Otolaryngology)',
            location: 'Room 304, ENT Center',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Tue & Fri', time: '9:00 AM – 12:00 PM' }
            ],
            active: true,
            sortOrder: 11
          },
          {
            id: 'doc-012',
            name: 'Dr. Ricardo Castillo',
            specialization: 'general-surgery',
            specializationLabel: 'General Surgery',
            location: 'Room 201, Surgical Suite',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Mon, Wed, Fri', time: '2:00 PM – 5:00 PM' }
            ],
            active: true,
            sortOrder: 12
          },
          {
            id: 'doc-013',
            name: 'Dr. Sofia Gutierrez',
            specialization: 'ob-gynecology',
            specializationLabel: 'OB-Gynecology',
            location: 'Room 108, Women\'s Health',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Mon – Sat', time: '9:00 AM – 3:00 PM' }
            ],
            active: true,
            sortOrder: 13
          },
          {
            id: 'doc-014',
            name: 'Dr. Eduardo Morales',
            specialization: 'neurology',
            specializationLabel: 'Neurology',
            location: 'Room 302, Neuro Clinic',
            image: 'assets/images/doctors/DAPPMC FINAL LOGO_1.png',
            schedule: [
              { days: 'Thu & Sat', time: '1:00 PM – 4:00 PM' }
            ],
            active: true,
            sortOrder: 14
          }
        ]
      }
    },

    /**
     * Load data from a JSON file (with localStorage override if present).
     * Falls back to embedded data when fetch is unavailable (file:// protocol).
     * @param {string} collection - e.g. 'news', 'packages'
     * @returns {Promise<Object>}
     */
    getData: function (collection) {
      if (this.dataCache[collection]) {
        return Promise.resolve(this.dataCache[collection]);
      }

      var self = this;
      var localKey = this.STORAGE_PREFIX + collection;

      // Check localStorage first (CMS edits take priority)
      var localData = localStorage.getItem(localKey);
      if (localData) {
        try {
          var parsed = JSON.parse(localData);

          // Auto-recover from a known corruption bug: an earlier version of
          // saveItem() could persist a NON-categorized collection (jobs,
          // packages) as an empty array, wiping out the existing data.
          // Detect and discard such empty overrides so the file data is used.
          // Only discard when EVERY array in the stored object is empty,
          // since categorized collections (e.g. news) can legitimately have
          // some categories with no items.
          var arrayKeys = 0;
          var emptyArrayKeys = 0;
          var isCorrupted = false;
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Array.isArray(parsed[collection])) {
            var storedArr = parsed[collection];
            if (storedArr.length === 0) {
              // For a single-key collection (jobs/packages), an empty array
              // means the whole collection was wiped -> corrupted.
              var nonArrayKeys = Object.keys(parsed).filter(function (key) {
                return key !== collection;
              }).length;
              if (nonArrayKeys === 0) {
                isCorrupted = true;
              } else {
                // Multi-key object: only corrupted if ALL arrays are empty.
                Object.keys(parsed).forEach(function (key) {
                  if (Array.isArray(parsed[key])) {
                    arrayKeys++;
                    if (parsed[key].length === 0) emptyArrayKeys++;
                  }
                });
                isCorrupted = (arrayKeys > 0 && emptyArrayKeys === arrayKeys);
              }
            }
          }

          if (!isCorrupted) {
            self.dataCache[collection] = parsed;
            return Promise.resolve(parsed);
          }
          console.warn('Discarded corrupted (empty) localStorage data for ' + collection);
        } catch (e) {
          console.warn('Invalid localStorage data for ' + collection, e);
        }
      }

      // Fall back to the JSON file
      var url = collection === 'jobs' ? 'careers/jobs.json' : 'assets/data/' + collection + '.json';
      return fetch(url)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Failed to load ' + collection + '.json');
          }
          return response.json();
        })
        .then(function (data) {
          self.dataCache[collection] = data;
          return data;
        })
        .catch(function (err) {
          // If fetch fails (e.g. file:// protocol), use embedded data
          console.warn('Using embedded data for ' + collection + ' (fetch failed):', err);
          var embedded = self.EMBEDDED_DATA[collection];
          if (embedded) {
            self.dataCache[collection] = embedded;
            return embedded;
          }
          throw err;
        });
    },

    /**
     * Get all items in a collection.
     * @param {string} collection
     * @returns {Promise<Array>}
     */
    getItems: function (collection) {
      return this.getData(collection).then(function (data) {
        // Collections are objects like { "news": [...] } or { "packages": [...] }
        if (Array.isArray(data)) return data;
        var keys = Object.keys(data);
        if (keys.length === 1 && Array.isArray(data[keys[0]])) {
          return data[keys[0]];
        }
        // Flatten all arrays
        var items = [];
        keys.forEach(function (key) {
          if (Array.isArray(data[key])) {
            items = items.concat(data[key]);
          }
        });
        return items;
      });
    },

    /**
     * Get items filtered by category (for news collections).
     * @param {string} collection
     * @param {string} category
     * @returns {Promise<Array>}
     */
    getItemsByCategory: function (collection, category) {
      return this.getItems(collection).then(function (items) {
        return items.filter(function (item) {
          return item.category === category;
        });
      });
    },

    /**
     * Save (add or update) an item in a collection.
     * @param {string} collection
     * @param {Object} item - must have a unique 'id'
     * @returns {Promise<Object>} saved item
     */
    saveItem: function (collection, item) {
      var self = this;
      return this.getItems(collection).then(function (items) {
        var existingIndex = -1;
        for (var i = 0; i < items.length; i++) {
          if (items[i].id === item.id) {
            existingIndex = i;
            break;
          }
        }

        if (existingIndex >= 0) {
          items[existingIndex] = item;
        } else {
          items.push(item);
        }

        return self._persist(collection, items).then(function () {
          return item;
        });
      });
    },

    /**
     * Delete an item from a collection.
     * @param {string} collection
     * @param {string} itemId
     * @returns {Promise<boolean>}
     */
    deleteItem: function (collection, itemId) {
      var self = this;
      return this.getItems(collection).then(function (items) {
        var filtered = items.filter(function (item) {
          return item.id !== itemId;
        });
        return self._persist(collection, filtered).then(function () {
          return true;
        });
      });
    },

    /**
     * Generate a unique ID for new items.
     * @param {string} prefix - e.g. 'news', 'pkg'
     * @returns {string}
     */
    generateId: function (prefix) {
      var timestamp = Date.now().toString(36);
      var random = Math.random().toString(36).substring(2, 7);
      return (prefix || 'item') + '-' + timestamp + '-' + random;
    },

    /**
     * Persist items to localStorage.
     * @private
     */
    _persist: function (collection, items) {
      var self = this;
      var localKey = this.STORAGE_PREFIX + collection;

      // Preserve collection structure if the original data was an object
      return this.getData(collection).then(function (originalData) {
        var toSave;
        if (Array.isArray(originalData)) {
          toSave = items;
        } else {
          toSave = {};

          // Determine if items carry a "category" property (e.g. news items do).
          // Jobs and packages do NOT have a "category" field.
          var itemsHaveCategories = items.some(function (item) {
            return item && typeof item.category === 'string';
          });

          Object.keys(originalData).forEach(function (key) {
            if (Array.isArray(originalData[key])) {
              if (!itemsHaveCategories) {
                // For collections without categories (jobs, packages, etc.),
                // replace the matching array with ALL updated items.
                if (key === collection) {
                  toSave[key] = items;
                } else {
                  toSave[key] = originalData[key];
                }
              } else {
                // For categorized collections (news), replace by category match.
                var matches = items.filter(function (item) {
                  return item.category === key;
                });
                if (matches.length > 0 || key === collection) {
                  toSave[key] = items.filter(function (item) {
                    return item.category === key;
                  });
                } else {
                  toSave[key] = originalData[key];
                }
              }
            } else {
              toSave[key] = originalData[key];
            }
          });
        }

        localStorage.setItem(localKey, JSON.stringify(toSave));
        self.dataCache[collection] = toSave;
        return toSave;
      });
    },

    /**
     * Export a collection as a downloadable JSON file.
     * @param {string} collection
     * @param {string} filename
     */
    exportData: function (collection, filename) {
      return this.getData(collection).then(function (data) {
        var blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json'
        });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename || collection + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return data;
      });
    },

    /**
     * Import data from a JSON string into localStorage.
     * @param {string} collection
     * @param {string} jsonString
     * @returns {Promise<Object>}
     */
    importData: function (collection, jsonString) {
      var self = this;
      return new Promise(function (resolve, reject) {
        try {
          var parsed = JSON.parse(jsonString);
          var localKey = self.STORAGE_PREFIX + collection;
          localStorage.setItem(localKey, JSON.stringify(parsed));
          self.dataCache[collection] = parsed;
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    },

    /**
     * Clear localStorage override for a collection (revert to file data).
     * @param {string} collection
     */
    resetData: function (collection) {
      var localKey = this.STORAGE_PREFIX + collection;
      localStorage.removeItem(localKey);
      delete this.dataCache[collection];
    },

    /**
     * Format a date string for display.
     * @param {string} dateStr - ISO date (YYYY-MM-DD)
     * @returns {string}
     */
    formatDate: function (dateStr) {
      if (!dateStr) return '';
      var date = new Date(dateStr + 'T00:00:00');
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    /**
     * Escape HTML to prevent XSS from user content.
     * @param {string} str
     * @returns {string}
     */
    escapeHtml: function (str) {
      if (!str) return '';
      var div = document.createElement('div');
      div.textContent = String(str);
      return div.innerHTML;
    }
  };

  window.CMS = CMS;
})(window);