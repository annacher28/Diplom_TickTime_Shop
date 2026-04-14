from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

# Сериализатор для регистрации нового пользователя
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'phone', 'address')

    # Проверяем, что пароль и подтверждение совпадают
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        return attrs

    # Создаём пользователя
    def create(self, validated_data):
        validated_data.pop('password2')  # убираем лишнее поле
        user = User.objects.create_user(**validated_data)
        user.role = 'user'   # все новые пользователи – обычные
        user.save()
        return user

# Сериализатор для просмотра/редактирования профиля (не показываем пароль)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone', 'address', 'role')
        read_only_fields = ('role',)  # роль нельзя менять через профиль