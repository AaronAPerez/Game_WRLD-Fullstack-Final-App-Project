using System.ComponentModel.DataAnnotations;

namespace api.Models.DTO
{
    public class UpdateUserProfileDTO
    {
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
    public string? Username { get; set; }

    [Url(ErrorMessage = "Invalid avatar URL")]
    public string? Avatar { get; set; }

    }
}