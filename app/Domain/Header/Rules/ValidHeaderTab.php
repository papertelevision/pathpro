<?php

namespace App\Domain\Header\Rules;

use App\Domain\Header\Enums\HeaderTabEnum;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidHeaderTab implements ValidationRule
{
    public function validate(
        string $attribute,
        mixed $value,
        Closure $fail
    ): void {
        if (!in_array($value, HeaderTabEnum::values())) {
            $fail('The tab type is invalid.');
        }
    }
}
