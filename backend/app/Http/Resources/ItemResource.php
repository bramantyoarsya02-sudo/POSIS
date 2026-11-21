<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ticket_number' => $this->ticket_number,
            'type' => $this->type?->value ?? $this->type,
            'title' => $this->title,
            'category' => $this->category,
            'location' => $this->location,
            'event_date' => $this->event_date?->format('Y-m-d'),
            'description' => $this->description,
            'photo_url' => $this->photo_path ? asset('storage/' . $this->photo_path) : null,
            'handover_point' => $this->handover_point?->value ?? $this->handover_point,
            'service_hours' => $this->service_hours ?? $this->handover_point?->serviceHours(),
            'status' => $this->status?->value ?? $this->status,
            'moderation_status' => $this->moderation_status?->value ?? $this->moderation_status,
            'reported_by' => $this->user ? $this->user->name . ' (' . ($this->user->class_or_division ?? 'Siswa') . ')' : 'Siswa SMKN 1 Ciomas',
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
