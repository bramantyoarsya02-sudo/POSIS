<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClaimResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'claim_number' => $this->claim_number,
            'item_id' => $this->item_id,
            'item_title' => $this->item?->title,
            'claimant_name' => $this->claimant ? $this->claimant->name . ' (' . ($this->claimant->class_or_division ?? 'Siswa') . ')' : 'Siswa',
            'proof_description' => $this->proof_description,
            'proof_photo_url' => $this->proof_photo_path ? asset('storage/' . $this->proof_photo_path) : null,
            'status' => $this->status,
            'verified_by_name' => $this->verifier?->name,
            'verification_note' => $this->verification_note,
            'verified_at' => $this->verified_at?->format('d M Y H:i') . ' WIB',
            'handover_at' => $this->handover_at?->format('d M Y H:i') . ' WIB',
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
