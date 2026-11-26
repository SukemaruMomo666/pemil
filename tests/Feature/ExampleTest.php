<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * Root domain diarahkan langsung ke /e-voting.
     */
    public function test_root_redirects_to_e_voting(): void
    {
        $response = $this->get('/');

        $response->assertRedirect('/e-voting');
    }

    /**
     * Halaman utama simulasi /e-voting dan cetak QR mengembalikan HTTP 200.
     */
    public function test_e_voting_routes_return_successful_response(): void
    {
        $this->get('/e-voting')->assertStatus(200);
        $this->get('/e-voting/cetak-qr')->assertStatus(200);
    }
}
