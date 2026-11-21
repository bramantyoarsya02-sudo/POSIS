<?php

return [
    'sla_days' => (int) env('POSIS_SLA_DAYS', 7),
    'max_daily_posts' => (int) env('POSIS_MAX_DAILY_POSTS', 5),
    'anonymous_visible_to_admin' => filter_var(env('POSIS_ANONYMOUS_VISIBLE_TO_ADMIN', true), FILTER_VALIDATE_BOOLEAN),
    'restricted_domain' => env('GOOGLE_RESTRICTED_DOMAIN', 'siswa.smkn1ciomas.sch.id'),
];
